import { DeviceEventEmitter } from 'react-native';
import { createReport } from './reports';
import {
  listPending,
  markFailed,
  markPending,
  markSending,
  removeReport,
  resetStuckSending,
} from './offlineReportQueue';
import { isNetworkError, isRetryableError } from '../utils/reportDate';

export interface FlushResult {
  /** Ids locais enviados com sucesso nesta passada. */
  sentIds: string[];
  /** Ids rejeitados definitivamente pelo backend nesta passada. */
  failedIds: string[];
  /** Mensagem do backend por id rejeitado. */
  errors: Record<string, string>;
  /** Itens que continuam na fila aguardando nova tentativa. */
  remaining: number;
}

const errorMessage = (error: any): string =>
  error?.message ? String(error.message) : 'Erro desconhecido';

/**
 * As passadas são encadeadas: nunca há dois envios ao mesmo tempo, e quem
 * chama depois de um item ser enfileirado sempre ganha uma passada que já
 * enxerga esse item.
 */
let chain: Promise<unknown> = Promise.resolve();

const runFlush = async (participationId: number): Promise<FlushResult> => {
  const result: FlushResult = {
    sentIds: [],
    failedIds: [],
    errors: {},
    remaining: 0,
  };

  await resetStuckSending(participationId);
  const items = await listPending(participationId);

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    await markSending(item.id);

    try {
      await createReport(item.payload);
      await removeReport(item.id);
      result.sentIds.push(item.id);
    } catch (error: any) {
      const message = errorMessage(error);

      if (isRetryableError(error)) {
        await markPending(item.id, message);
        // Sem rede (ou servidor indisponível) os próximos vão falhar igual:
        // encerra a passada e espera o próximo gatilho de sincronização.
        result.remaining = items.length - index;
        if (__DEV__) {
          console.log(
            '[reportSync] envio adiado:',
            isNetworkError(error) ? 'sem conexão' : message
          );
        }
        break;
      }

      await markFailed(item.id, message);
      result.failedIds.push(item.id);
      result.errors[item.id] = message;
      console.warn('[reportSync] report rejeitado pelo backend:', message);
    }
  }

  if (result.sentIds.length > 0) {
    // Mesmo evento que o fluxo online já usava: atualiza calendário e mapa.
    DeviceEventEmitter.emit('report_created');
  }

  return result;
};

export const flushQueue = (participationId: number): Promise<FlushResult> => {
  const run = chain.then(
    () => runFlush(participationId),
    () => runFlush(participationId)
  );
  chain = run.catch(() => undefined);
  return run;
};
