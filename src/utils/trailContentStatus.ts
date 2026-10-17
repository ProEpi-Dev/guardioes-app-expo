import { Sequence } from '../types/trail';
import { ItemStatus, TimelineTheme } from '../types/trailContent';

const isScheduleExpired = (seq: Sequence) => seq.scheduleState === 'expired';

/**
 * Concluído no backend, ou aprovado sem o prazo ter vencido (o resync da trilha
 * conclui no backend). Aprovação feita depois do prazo não conta para a trilha.
 */
const isItemCompleted = (seq: Sequence) =>
  seq.rawBackendStatus === 'completed' ||
  (seq.progressStatus === 'completed' && !isScheduleExpired(seq)) ||
  (!!seq.isPassed && !isScheduleExpired(seq));

export const getItemStatus = (seq: Sequence): ItemStatus => {
  // 1. Inativo
  if (!seq.active) {
    return 'locked';
  }

  // 2. Concluído (antes do bloqueio: depois do prazo o backend bloqueia, mas o
  // item concluído continua concluído)
  if (isItemCompleted(seq)) {
    return 'completed';
  }

  // 3. Prazo encerrado sem conclusão: a pessoa pode ter tentado, então não é
  // o mesmo que "bloqueado"
  if (seq.isLocked && isScheduleExpired(seq)) {
    return 'expired';
  }

  // 4. Bloqueado (ainda não abriu ou depende do item anterior)
  if (seq.isLocked) {
    return 'locked';
  }

  // 5. Formulário estourou tentativas
  if (
    seq.form &&
    seq.maxAttempts != null &&
    seq.attemptNumber != null &&
    seq.attemptNumber >= seq.maxAttempts
  ) {
    return 'failed';
  }

  // 6. Item disponível
  if (seq.form || seq.content) {
    return 'current';
  }

  // 7. Fallback
  return 'locked';
};

const formatScheduleDay = (ymd?: string | null) => {
  if (!ymd) return null;
  const [y, m, d] = ymd.split('-');
  return y && m && d ? `${d}/${m}/${y}` : null;
};

/**
 * Texto do item com prazo encerrado: o que aconteceu com ele, para não parecer
 * que a pessoa não fez. Ex.: "Prazo encerrado em 21/09/2026 · Reprovado (80/100)".
 */
export const getExpiredItemLabel = (seq: Sequence): string => {
  const day = formatScheduleDay(seq.scheduleEnd);
  const prefix = day ? `Prazo encerrado em ${day}` : 'Prazo encerrado';
  const hasAttempt = seq.score !== null && seq.score !== undefined;

  if (!seq.form) {
    return `${prefix} · Não concluído`;
  }
  if (!hasAttempt) {
    return `${prefix} · Não respondido`;
  }
  if (seq.isPassed) {
    return `${prefix} · Aprovado fora do prazo (${seq.score}/100)`;
  }
  return `${prefix} · Reprovado (${seq.score}/100)`;
};

export const getItemTheme = (status: ItemStatus): TimelineTheme => {
  switch (status) {
    case 'completed':
      return {
        color: '#3b82f6',
        bg: '#3b82f6',
        borderColor: '#3b82f6',
        icon: 'check',
        lightColor: '#4CAF50',
      };
    case 'failed':
      return {
        color: '#3b82f6',
        bg: '#3b82f6',
        borderColor: '#3b82f6',
        icon: 'check',
        lightColor: '#F44336',
      };
    case 'current':
      return {
        color: '#000',
        bg: '#fff',
        borderColor: '#000',
        icon: 'unlock',
        lightColor: '#000',
      };
    case 'expired':
      return {
        color: '#B45309',
        bg: '#FEF3C7',
        borderColor: '#F59E0B',
        icon: 'clock',
        lightColor: '#B45309',
      };
    case 'locked':
    default:
      return {
        color: '#9ca3af',
        bg: '#e5e7eb',
        borderColor: '#d1d5db',
        icon: 'lock',
        lightColor: '#9ca3af',
      };
  }
};
