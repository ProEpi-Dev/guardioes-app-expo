import { FieldCondition } from '../types/form';

export const evaluateCondition = (
  condition: FieldCondition,
  fieldValue: any
): boolean => {
  const { operator, value } = condition;

  let comparisonValue = value;

  // Normalização de tipos
  if (typeof fieldValue === 'boolean') {
    if (String(value).toLowerCase() === 'true') comparisonValue = true;
    if (String(value).toLowerCase() === 'false') comparisonValue = false;
  } else if (typeof fieldValue === 'number') {
    comparisonValue = Number(value);
  }

  switch (operator) {
    case 'equals':
      return fieldValue === comparisonValue;
    case 'notEquals':
      return fieldValue !== comparisonValue;
    case 'contains':
      if (Array.isArray(fieldValue))
        return fieldValue.includes(comparisonValue);
      return String(fieldValue).includes(String(comparisonValue));
    case 'greaterThan':
      return Number(fieldValue) > Number(comparisonValue);
    case 'lessThan':
      return Number(fieldValue) < Number(comparisonValue);
    case 'isEmpty':
      return (
        !fieldValue ||
        fieldValue === '' ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );
    case 'isNotEmpty':
      return (
        fieldValue &&
        fieldValue !== '' &&
        (!Array.isArray(fieldValue) || fieldValue.length > 0)
      );
    default:
      return true;
  }
};
