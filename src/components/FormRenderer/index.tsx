import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { FormBuilderDefinition, FormField, FieldCondition } from '../../types/form';
import { CustomDatePicker } from '../CustomDatePicker';
import { CustomSelector, Option } from '../CustomSelector';

interface FormRendererProps {
  definition: FormBuilderDefinition;
  initialValues?: Record<string, any>;
  onChange?: (values: Record<string, any>) => void;
  readOnly?: boolean;
}

interface FieldErrors {
  [fieldId: string]: string;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  definition,
  initialValues = {},
  onChange,
  readOnly = false,
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset valores quando definição mudar
  useEffect(() => {
    const newValues: Record<string, any> = {};
    definition.fields.forEach((field) => {
      if (initialValues[field.name] !== undefined) {
        newValues[field.name] = initialValues[field.name];
      } else if (field.defaultValue !== undefined) {
        newValues[field.name] = field.defaultValue;
      } else {
        // Valores padrão por tipo
        switch (field.type) {
          case 'text':
          case 'select':
            newValues[field.name] = '';
            break;
          case 'number':
            newValues[field.name] = null;
            break;
          case 'boolean':
            newValues[field.name] = false;
            break;
          case 'multiselect':
            newValues[field.name] = [];
            break;
          case 'date':
            newValues[field.name] = null;
            break;
        }
      }
    });
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [JSON.stringify(definition.fields)]);

  // Avaliar condições de um campo
  const evaluateConditions = (field: FormField): boolean => {
    if (!field.conditions || field.conditions.length === 0) {
      return true;
    }

    return field.conditions.every((condition) => {
      const targetFieldDefinition = definition.fields.find(f => f.id === condition.fieldId);
      if (!targetFieldDefinition) return false;
      const fieldValue = values[targetFieldDefinition.name];
      
      return evaluateCondition(condition, fieldValue);
    });
  };

  // Avaliar uma condição individual
  const evaluateCondition = (condition: FieldCondition, fieldValue: any): boolean => {
    const { operator, value } = condition;
    
    let comparisonValue = value;

    if (typeof fieldValue === 'boolean') {
        if (String(value).toLowerCase() === 'true') comparisonValue = true;
        if (String(value).toLowerCase() === 'false') comparisonValue = false;
    }

    else if (typeof fieldValue === 'number') {
        comparisonValue = Number(value);
    }

    switch (operator) {
      case 'equals':
        return fieldValue === comparisonValue;
      case 'notEquals':
        return fieldValue !== comparisonValue;
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(comparisonValue);
        }
        return String(fieldValue).includes(String(comparisonValue));
      case 'greaterThan':
        return Number(fieldValue) > Number(comparisonValue);
      case 'lessThan':
        return Number(fieldValue) < Number(comparisonValue);
      case 'isEmpty':
        return !fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'isNotEmpty':
        return fieldValue && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
      default:
        return true;
    }
  };

  // Validar um campo
  const validateField = (field: FormField, value: any): string | null => {
    // Campos ocultos não são validados
    if (!evaluateConditions(field)) {
      return null;
    }

    // Validação de obrigatório
    if (field.required) {
      if (field.type === 'text' || field.type === 'select') {
        if (!value || value === '') {
          return `${field.label} é obrigatório`;
        }
      } else if (field.type === 'number') {
        if (value === null || value === undefined || value === '') {
          return `${field.label} é obrigatório`;
        }
      } else if (field.type === 'boolean') {
        if (!value) {
          return `${field.label} é obrigatório`;
        }
      } else if (field.type === 'multiselect') {
        if (!Array.isArray(value) || value.length === 0) {
          return `${field.label} é obrigatório`;
        }
      }
    }

    // Validação de número
    if (field.type === 'number' && value !== null && value !== undefined && value !== '') {
      const numValue = Number(value);
      if (field.min !== undefined && numValue < field.min) {
        return `Valor deve ser maior ou igual a ${field.min}`;
      }
      if (field.max !== undefined && numValue > field.max) {
        return `Valor deve ser menor ou igual a ${field.max}`;
      }
    }

    // Validação de texto
    if (field.type === 'text' && value && field.maxLength) {
      if (value.length > field.maxLength) {
        return `Máximo de ${field.maxLength} caracteres`;
      }
    }

    return null;
  };

  // Validar todos os campos
  const validateAll = (): boolean => {
    const newErrors: FieldErrors = {};
    let isValid = true;

    definition.fields.forEach((field) => {
      const error = validateField(field, values[field.name]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Atualizar valor de um campo
  const updateValue = (fieldName: string, value: any) => {
    const newValues = { ...values, [fieldName]: value };
    setValues(newValues);
    setTouched({ ...touched, [fieldName]: true });

    // Validar campo
    const field = definition.fields.find((f) => f.name === fieldName);
    if (field) {
      const error = validateField(field, value);
      if (error) {
        setErrors({ ...errors, [field.id]: error });
      } else {
        const newErrors = { ...errors };
        delete newErrors[field.id];
        setErrors(newErrors);
      }
    }

    // Chamar onChange com validação completa
    setTimeout(() => {
      const allValid = validateAll();
      if (onChange) {
        onChange({ ...newValues, _isValid: allValid });
      }
    }, 0);
  };

  // Filtrar campos visíveis
  const visibleFields = useMemo(() => {
    return definition.fields.filter((field) => evaluateConditions(field));
  }, [definition.fields, values]);

  // Renderizar campo de texto
  const renderTextField = (field: FormField) => {
    return (
      <View key={field.id} style={styles.fieldContainer}>
        <Text style={styles.label}>
          {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
        <TextInput
          style={[styles.input, errors[field.id] && styles.inputError]}
          value={values[field.name] || ''}
          onChangeText={(text) => updateValue(field.name, text)}
          placeholder={field.placeholder}
          editable={!readOnly}
          maxLength={field.maxLength}
        />
        {errors[field.id] && <Text style={styles.errorText}>{errors[field.id]}</Text>}
      </View>
    );
  };

  // Renderizar campo numérico
  const renderNumberField = (field: FormField) => {
    return (
      <View key={field.id} style={styles.fieldContainer}>
        <Text style={styles.label}>
          {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
        <TextInput
          style={[styles.input, errors[field.id] && styles.inputError]}
          value={values[field.name] !== null && values[field.name] !== undefined ? String(values[field.name]) : ''}
          onChangeText={(text) => {
            const numValue = text === '' ? null : Number(text);
            updateValue(field.name, numValue);
          }}
          placeholder={field.placeholder}
          keyboardType="numeric"
          editable={!readOnly}
        />
        {errors[field.id] && <Text style={styles.errorText}>{errors[field.id]}</Text>}
      </View>
    );
  };

  // Renderizar campo boolean
  const renderBooleanField = (field: FormField) => {
    return (
      <View key={field.id} style={styles.fieldContainer}>
        <View style={styles.switchContainer}>
          <Text style={[styles.label, {flex: 1, paddingRight: 10, marginBottom: 0}]}>
            {field.label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>
          <Switch
            value={values[field.name] || false}
            onValueChange={(value) => updateValue(field.name, value)}
            disabled={readOnly}
          />
        </View>
        {errors[field.id] && <Text style={styles.errorText}>{errors[field.id]}</Text>}
      </View>
    );
  };

  // Renderizar campo select
  const renderSelectField = (field: FormField) => {
    const selectedOption = field.options?.find(opt => opt.value === values[field.name]);
    
    const displayLabel = selectedOption ? selectedOption.label : (field.placeholder || 'Selecione...');

    const selectorData: Option[] = field.options?.map(opt => ({
      label: opt.label,
      value: opt.value,
      key: String(opt.value)
    })) || [];

    return (
      <View key={field.id} style={styles.fieldContainer}>
        <Text style={styles.label}>
          {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
        
        <CustomSelector
          key={`${field.id}-${values[field.name]}`}
          
          data={selectorData}
          initValue={displayLabel}
          disabled={readOnly}
          onChange={(option) => updateValue(field.name, option.value)}
          
          selectStyle={[
            styles.input, 
            errors[field.id] ? styles.inputError : null,
            { justifyContent: 'center' }
          ]}
          
          selectTextStyle={{
            fontSize: 16,
            color: '#32323b'
          }}
          initValueTextStyle={{
            fontSize: 16,
            color: selectedOption ? '#32323b' : '#C7C7CD'
          }}

          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 }}
          optionContainerStyle={{ backgroundColor: 'white', borderRadius: 12, maxHeight: '50%', overflow: 'hidden' }}
          optionStyle={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
          optionTextStyle={{ fontSize: 16, color: '#32323b', textAlign: 'center' }}
          
          cancelContainerStyle={{ marginTop: 12, backgroundColor: 'white', borderRadius: 12 }}
          cancelStyle={{ padding: 16, alignItems: 'center' }}
          cancelTextStyle={{ color: '#e74c3c', fontSize: 16, fontWeight: '600' }}
        />

        {errors[field.id] && <Text style={styles.errorText}>{errors[field.id]}</Text>}
      </View>
    );
  };

  // Renderizar campo multiselect
  const renderMultiselectField = (field: FormField) => {
    const selectedValues = values[field.name] || [];
    
    const toggleOption = (optionValue: string | number) => {
      const newSelected = selectedValues.includes(optionValue)
        ? selectedValues.filter((v: any) => v !== optionValue)
        : [...selectedValues, optionValue];
      updateValue(field.name, newSelected);
    };

    return (
      <View key={field.id} style={styles.fieldContainer}>
        <Text style={styles.label}>
          {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
        {field.options?.map((option) => (
          <TouchableOpacity
            key={String(option.label)}
            style={styles.checkboxContainer}
            onPress={() => !readOnly && toggleOption(option.value)}
            disabled={readOnly}
          >
            <View style={[styles.checkbox, selectedValues.includes(option.value) && styles.checkboxChecked]}>
              {selectedValues.includes(option.value) && <Text style={styles.checkboxMark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
        {errors[field.id] && <Text style={styles.errorText}>{errors[field.id]}</Text>}
      </View>
    );
  };

  // Renderizar campo de data
  const renderDateField = (field: FormField) => {
    const rawValue = values[field.name];
    
    const dateValue = rawValue instanceof Date 
      ? rawValue 
      : (rawValue ? new Date(rawValue) : null);

    return (
      <View key={field.id} style={styles.fieldContainer}>
        <Text style={styles.label}>
          {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>

        <View 
          pointerEvents={readOnly ? 'none' : 'auto'} 
          style={{ opacity: readOnly ? 0.6 : 1 }}
        >
          <CustomDatePicker
            date={dateValue}
            placeholder={field.placeholder}
            onDateChange={(newDate) => updateValue(field.name, newDate)}
            style={[
              styles.input, 
              errors[field.id] && styles.inputError,
              { justifyContent: 'center' }
            ]}
            customStyles={{
              dateText: { fontSize: 16, color: '#000' },
              placeholderText: { fontSize: 16, color: '#C7C7CD' }
            }}
          />
        </View>

        {errors[field.id] && <Text style={styles.errorText}>{errors[field.id]}</Text>}
      </View>
    );
  };

  // Renderizar campo baseado no tipo
  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return renderTextField(field);
      case 'number':
        return renderNumberField(field);
      case 'boolean':
        return renderBooleanField(field);
      case 'select':
        return renderSelectField(field);
      case 'multiselect':
        return renderMultiselectField(field);
      case 'date':
        return renderDateField(field);
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {definition.title && <Text style={styles.title}>{definition.title}</Text>}
        {definition.description && <Text style={styles.description}>{definition.description}</Text>}
        {visibleFields.map((field) => renderField(field))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#32323b',
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    color: '#666',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#32323b',
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2E97BE',
    borderColor: '#2E97BE',
  },
  checkboxMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#32323b',
  },
});

