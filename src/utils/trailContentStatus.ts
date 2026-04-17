import { Sequence } from '../types/trail';
import { ItemStatus, TimelineTheme } from '../types/trailContent';

export const getItemStatus = (seq: Sequence): ItemStatus => {
  // 1. Bloqueado
  if (seq.isLocked || !seq.active) {
    return 'locked';
  }

  // 2. Concluído
  if (seq.progressStatus === 'completed' || seq.isPassed) {
    return 'completed';
  }

  // 3. Formulário estourou tentativas
  if (
    seq.form &&
    seq.maxAttempts != null &&
    seq.attemptNumber != null &&
    seq.attemptNumber >= seq.maxAttempts
  ) {
    return 'failed';
  }

  // 4. Item disponível
  if (seq.form || seq.content) {
    return 'current';
  }

  // 5. Fallback
  return 'locked';
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
