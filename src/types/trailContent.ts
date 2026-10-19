/**
 * expired: o prazo do item acabou sem ele ter sido concluído. Diferente de
 * locked (ainda não liberado), porque a pessoa pode ter feito o item.
 */
export type ItemStatus =
  | 'locked'
  | 'current'
  | 'completed'
  | 'failed'
  | 'expired';

export interface TimelineTheme {
  color: string;
  bg: string;
  borderColor: string;
  icon: string;
  lightColor: string;
}
