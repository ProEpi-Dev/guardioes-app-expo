export const formatDate = (
  date: Date | null | undefined,
  placeholder: string
): string => {
  if (!date) return placeholder;
  return date.toLocaleDateString('pt-BR');
};
