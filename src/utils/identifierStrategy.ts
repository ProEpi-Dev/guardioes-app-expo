export interface IdentifierStrategy {
  getLabel(): string;
  getPlaceholder(): string;
  validate(value: string | undefined): string | null;
}

export class UnbIdentifierStrategy implements IdentifierStrategy {
  private readonly regexUnb = /^\d{9}$/;

  getLabel() {
    return 'Digite sua Matrícula:';
  }

  getPlaceholder() {
    return 'Matrícula (9 números)';
  }

  validate(value: string | undefined): string | null {
    if (value && !this.regexUnb.test(value)) {
      return 'A matrícula deve conter exatamente 9 números, sem espaços ou caracteres especiais.';
    }
    return null;
  }
}

export class DefaultIdentifierStrategy implements IdentifierStrategy {
  getLabel() {
    return 'CPF, RG ou outro identificador:';
  }

  getPlaceholder() {
    return 'Seu identificador externo';
  }

  validate(_value: string | undefined): string | null {
    // Validação genérica ou nula
    return null;
  }
}

export class IdentifierStrategyContext {
  private strategy: IdentifierStrategy;

  constructor(isUnb: boolean) {
    this.strategy = isUnb
      ? new UnbIdentifierStrategy()
      : new DefaultIdentifierStrategy();
  }

  getStrategy() {
    return this.strategy;
  }
}
