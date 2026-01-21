export const normalizeAnswer = (val: any): string => {
  if (val === null || val === undefined) return '';
  return String(val).trim().toLowerCase();
};