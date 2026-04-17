import { useState, useEffect, useMemo, useCallback } from 'react';
import { FormBuilderDefinition, FormField } from '../types/form';
import { evaluateCondition } from '../utils/evaluateCondition';

interface UseFormProps {
  definition: FormBuilderDefinition;
  initialValues?: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
}

export const useForm = ({
  definition,
  initialValues = {},
  onChange,
}: UseFormProps) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 1. Inicialização
  useEffect(() => {
    const newValues: Record<string, any> = {};
    definition.fields.forEach((field) => {
      if (initialValues[field.name] !== undefined) {
        newValues[field.name] = initialValues[field.name];
      } else if (field.defaultValue !== undefined) {
        newValues[field.name] = field.defaultValue;
      } else {
        switch (field.type) {
          case 'boolean':
            newValues[field.name] = false;
            break;
          case 'multiselect':
            newValues[field.name] = [];
            break;
          case 'number':
          case 'date':
            newValues[field.name] = null;
            break;
          default:
            newValues[field.name] = '';
        }
      }
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(newValues);
    setErrors({});
  }, [JSON.stringify(definition.fields)]);

  // 2. Verifica Visibilidade (Aceita valores opcionais para validação em tempo real)
  const checkFieldVisibility = useCallback(
    (field: FormField, currentValues = values) => {
      if (!field.conditions || field.conditions.length === 0) return true;

      return field.conditions.every((condition) => {
        const targetField = definition.fields.find(
          (f) => f.id === condition.fieldId
        );
        if (!targetField) return false;
        return evaluateCondition(condition, currentValues[targetField.name]);
      });
    },
    [definition.fields, values]
  );

  // 3. Validação de Campo Único
  const validateField = useCallback(
    (field: FormField, value: any, currentValues = values): string | null => {
      // Se o campo está oculto, ele é sempre válido
      if (!checkFieldVisibility(field, currentValues)) return null;

      if (field.required) {
        const isEmpty =
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);
        if (isEmpty) return `${field.label} é obrigatório`;
      }

      if (field.type === 'number' && value !== null && value !== '') {
        const num = Number(value);
        if (field.min !== undefined && num < field.min)
          return `Mínimo: ${field.min}`;
        if (field.max !== undefined && num > field.max)
          return `Máximo: ${field.max}`;
      }

      if (
        field.type === 'text' &&
        field.maxLength &&
        value?.length > field.maxLength
      ) {
        return `Máximo de ${field.maxLength} caracteres`;
      }

      return null;
    },
    [checkFieldVisibility, values]
  );

  // 4. Calcula validade total do formulário com base nos valores passados
  const calculateIsValid = useCallback(
    (currentValues: Record<string, any>) => {
      return definition.fields.every((field) => {
        const error = validateField(
          field,
          currentValues[field.name],
          currentValues
        );
        return !error; // Se não tem erro, é válido
      });
    },
    [definition.fields, validateField]
  );

  // 5. Update Handler
  const updateValue = (fieldName: string, value: any) => {
    // Cria o novo objeto de valores
    const newValues = { ...values, [fieldName]: value };

    setValues(newValues);
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    // Valida o campo atual para exibir erro na UI
    const field = definition.fields.find((f) => f.name === fieldName);
    if (field) {
      const error = validateField(field, value, newValues);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) next[field.id] = error;
        else delete next[field.id];
        return next;
      });
    }

    // Callback para o pai com a propriedade _isValid calculada corretamente
    if (onChange) {
      const isValid = calculateIsValid(newValues);
      // Usamos setTimeout para garantir que não bloqueie a renderização da UI
      setTimeout(() => {
        onChange({ ...newValues, _isValid: isValid });
      }, 0);
    }
  };

  // 6. Campos Visíveis (para renderização)
  const visibleFields = useMemo(() => {
    return definition.fields.filter((f) => checkFieldVisibility(f, values));
  }, [definition.fields, checkFieldVisibility, values]);

  return {
    values,
    errors,
    touched,
    visibleFields,
    updateValue,
  };
};
