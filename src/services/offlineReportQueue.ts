import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReportPayload } from './reports';

/**
 * Fila local de reports aguardando envio.
 *
 * Todo report (online ou offline) entra aqui antes de ser enviado; o
 * `reportSync` remove o item assim que o backend confirma (2xx). Assim existe
 * um único caminho de envio e nenhum report se perde se a rede cair no meio.
 *
 * Layout no AsyncStorage:
 *   - INDEX_KEY            -> JSON com a lista de ids, em ordem de criação
 *   - ITEM_PREFIX + <id>   -> JSON de um QueuedReport
 *
 * Uma chave por report mantém cada valor pequeno (o Android limita ~2 MB por
 * valor) e permite remover um item sem reescrever a fila inteira.
 */

const INDEX_KEY = '@guardioes/offline_reports:index';
const ITEM_PREFIX = '@guardioes/offline_report:';

export const MAX_QUEUE_SIZE = 500;

export type QueuedReportStatus = 'pending' | 'sending' | 'failed';

export interface QueuedReport {
  id: string;
  participationId: number;
  payload: ReportPayload;
  status: QueuedReportStatus;
  attempts: number;
  lastError: string | null;
  createdLocalAt: string;
}

export class QueueFullError extends Error {
  constructor() {
    super('Fila de reports offline cheia.');
    this.name = 'QueueFullError';
  }
}

let lock: Promise<unknown> = Promise.resolve();
const withLock = <T>(fn: () => Promise<T>): Promise<T> => {
  const run = lock.then(fn, fn);
  lock = run.catch(() => undefined);
  return run;
};

type Listener = () => void;
const listeners = new Set<Listener>();

export const subscribeQueue = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notify = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.warn('[offlineQueue] listener falhou', error);
    }
  });
};

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const readIndex = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(INDEX_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeIndex = (ids: string[]) =>
  AsyncStorage.setItem(INDEX_KEY, JSON.stringify(ids));

const readItem = async (id: string): Promise<QueuedReport | null> => {
  const raw = await AsyncStorage.getItem(ITEM_PREFIX + id);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QueuedReport;
  } catch {
    return null;
  }
};

const writeItem = (item: QueuedReport) =>
  AsyncStorage.setItem(ITEM_PREFIX + item.id, JSON.stringify(item));

const readAll = async (): Promise<QueuedReport[]> => {
  const ids = await readIndex();
  if (ids.length === 0) return [];

  const pairs = await AsyncStorage.multiGet(ids.map((id) => ITEM_PREFIX + id));
  const items: QueuedReport[] = [];
  pairs.forEach(([, raw]) => {
    if (!raw) return;
    try {
      items.push(JSON.parse(raw) as QueuedReport);
    } catch {}
  });
  return items;
};

export const enqueueReport = (
  participationId: number,
  payload: ReportPayload
): Promise<QueuedReport> =>
  withLock(async () => {
    const ids = await readIndex();
    if (ids.length >= MAX_QUEUE_SIZE) {
      throw new QueueFullError();
    }

    const item: QueuedReport = {
      id: generateId(),
      participationId,
      payload,
      status: 'pending',
      attempts: 0,
      lastError: null,
      createdLocalAt: new Date().toISOString(),
    };

    await writeItem(item);
    await writeIndex([...ids, item.id]);
    notify();
    return item;
  });

export const listPending = async (
  participationId: number
): Promise<QueuedReport[]> => {
  const items = await readAll();
  return items.filter(
    (item) =>
      item.participationId === participationId && item.status !== 'failed'
  );
};

export const getReport = (id: string) => readItem(id);

export const countPending = async (participationId: number) =>
  (await listPending(participationId)).length;

export const hasPendingPositiveOnDay = async (
  participationId: number,
  day: string
): Promise<boolean> => {
  const items = await listPending(participationId);
  return items.some(
    (item) =>
      item.payload.reportType === 'POSITIVE' &&
      item.payload.reportDate.slice(0, 10) === day
  );
};

const updateItem = (
  id: string,
  patch: (item: QueuedReport) => Partial<QueuedReport>
) =>
  withLock(async () => {
    const item = await readItem(id);
    if (!item) return null;
    const next = { ...item, ...patch(item) };
    await writeItem(next);
    return next;
  });

export const markSending = (id: string) =>
  updateItem(id, (item) => ({
    status: 'sending',
    attempts: item.attempts + 1,
  }));

export const markPending = (id: string, error: string | null) =>
  updateItem(id, () => ({ status: 'pending', lastError: error }));

export const markFailed = async (id: string, error: string | null) => {
  const result = await updateItem(id, () => ({
    status: 'failed',
    lastError: error,
  }));
  notify();
  return result;
};

export const removeReport = (id: string) =>
  withLock(async () => {
    const ids = await readIndex();
    await writeIndex(ids.filter((existing) => existing !== id));
    await AsyncStorage.removeItem(ITEM_PREFIX + id);
    notify();
  });

export const resetStuckSending = (participationId: number) =>
  withLock(async () => {
    const items = await readAll();
    const stuck = items.filter(
      (item) =>
        item.participationId === participationId && item.status === 'sending'
    );
    await Promise.all(
      stuck.map((item) => writeItem({ ...item, status: 'pending' }))
    );
  });
