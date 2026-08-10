/**
 * Estado de indisponibilidade compartilhado entre o interceptor do axios e a
 * árvore React.
 *
 * Módulo simples de propósito: o interceptor roda fora do React e precisa
 * publicar o 503 assim que ele chega, sem depender de hook ou provider.
 */

export type MaintenanceMode = 'banner' | 'read_only' | 'full';

/** Espelha `error.maintenance` do backend. */
export interface MaintenanceInfo {
  mode: MaintenanceMode;
  title: string;
  message: string;
  startsAt: string | null;
  endsAt: string | null;
  /**
   * false quando o 503 veio sem o payload da API — proxy respondendo por um
   * backend fora do ar. A tela cai no texto genérico.
   */
  fromApi: boolean;
}

type Listener = (state: MaintenanceInfo | null) => void;

const listeners = new Set<Listener>();
let current: MaintenanceInfo | null = null;

export function getMaintenance(): MaintenanceInfo | null {
  return current;
}

export function setMaintenance(info: MaintenanceInfo | null): void {
  const changed = JSON.stringify(current) !== JSON.stringify(info);
  current = info;

  if (changed) {
    listeners.forEach((listener) => listener(current));
  }
}

export function clearMaintenance(): void {
  setMaintenance(null);
}

export function subscribeMaintenance(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Traduz uma resposta 503 no estado da tela.
 *
 * Aceita os dois sabores: o 503 do MaintenanceGuard, que traz
 * `error.code = MAINTENANCE` e detalhes, e o 503 opaco de proxy, que não traz
 * nada. Só o modo `full` bloqueia a navegação; `read_only` e `banner` deixam o
 * app seguir e a falha ser tratada pela tela que originou a chamada.
 */
export function maintenanceFromResponse(
  status: number | undefined,
  data: unknown
): MaintenanceInfo | null {
  if (status !== 503) {
    return null;
  }

  const error = (data as { error?: Record<string, unknown> } | undefined)
    ?.error;
  const details = error?.maintenance as Record<string, unknown> | undefined;

  if (error?.code !== 'MAINTENANCE' || !details) {
    return {
      mode: 'full',
      title: '',
      message: '',
      startsAt: null,
      endsAt: null,
      fromApi: false,
    };
  }

  return {
    mode: (details.mode as MaintenanceMode) ?? 'full',
    title: typeof details.title === 'string' ? details.title : '',
    message: typeof error.message === 'string' ? error.message : '',
    startsAt: typeof details.startsAt === 'string' ? details.startsAt : null,
    endsAt: typeof details.endsAt === 'string' ? details.endsAt : null,
    fromApi: true,
  };
}
