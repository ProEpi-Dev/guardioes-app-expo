import translate from '../locales/i18n';

export type IdentifierStrategyType = 'unb_student' | 'default';

export interface IdentifierStrategy {
  label: string;
  placeholder: string;
  validate: (value: string | undefined) => string | null;
}

const unbStudentStrategy: IdentifierStrategy = {
  label: translate('finishProfile.identifier.unb.label'),
  placeholder: translate('finishProfile.identifier.unb.placeholder'),
  validate: (value: string | undefined): string | null => {
    const regexUnb = /^\d{9}$/;
    if (value && !regexUnb.test(value)) {
      return translate('finishProfile.identifier.unb.validationError');
    }
    return null;
  },
};

const defaultStrategy: IdentifierStrategy = {
  label: translate('finishProfile.identifier.default.label'),
  placeholder: translate('finishProfile.identifier.default.placeholder'),
  validate: (value: string | undefined): string | null => {
    const regexDefault = /^[a-zA-Z0-9]+$/;
    if (value && !regexDefault.test(value)) {
      return translate('finishProfile.identifier.default.validationError');
    }
    return null;
  },
};

export const getIdentifierStrategy = (
  type: IdentifierStrategyType
): IdentifierStrategy => {
  return type === 'unb_student' ? unbStudentStrategy : defaultStrategy;
};
