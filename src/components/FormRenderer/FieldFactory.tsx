import React from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CustomDatePicker } from '../CustomDatePicker';
import { CustomSelector } from '../CustomSelector';
import { Option } from '../../types/customSelector';
import { FieldFactoryProps } from '../../types/formRenderer';

export const FieldFactory: React.FC<FieldFactoryProps> = ({
  field,
  value,
  error,
  readOnly,
  onChange,
  containerStyle,
}) => {
  const commonInputStyles = [styles.input, error ? styles.inputError : null];

  const renderTextField = () => (
    <TextInput
      style={commonInputStyles}
      value={value || ''}
      onChangeText={onChange}
      placeholder={field.placeholder}
      editable={!readOnly}
      maxLength={field.maxLength}
      placeholderTextColor="#C7C7CD"
    />
  );

  const renderNumberField = () => (
    <TextInput
      style={commonInputStyles}
      value={value !== null && value !== undefined ? String(value) : ''}
      onChangeText={(text) => {
        onChange(text === '' ? null : Number(text));
      }}
      placeholder={field.placeholder}
      keyboardType="numeric"
      editable={!readOnly}
      placeholderTextColor="#C7C7CD"
    />
  );

  const renderSelectField = () => {
    const selectorOptions: Option[] =
      field.options?.map((opt) => ({
        label: opt.label,
        value: opt.value,
        key: String(opt.value),
      })) || [];
    const selectedOption = field.options?.find((opt) => opt.value === value);
    const displayLabel = selectedOption
      ? selectedOption.label
      : field.placeholder || 'Selecione...';

    return (
      <CustomSelector
        data={selectorOptions}
        initValue={displayLabel}
        disabled={readOnly}
        onChange={(option) => onChange(option.value)}
        selectStyle={[
          styles.input,
          error ? styles.inputError : null,
          { justifyContent: 'center' },
        ]}
        selectTextStyle={{ fontSize: 16, color: '#32323b' }}
        initValueTextStyle={{
          fontSize: 16,
          color: selectedOption ? '#32323b' : '#C7C7CD',
        }}
        overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 }}
        optionContainerStyle={{
          backgroundColor: 'white',
          borderRadius: 12,
          maxHeight: '50%',
          overflow: 'hidden',
        }}
        optionStyle={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
        }}
        cancelContainerStyle={{
          marginTop: 12,
          backgroundColor: 'white',
          borderRadius: 12,
          overflow: 'hidden',
        }}
        cancelStyle={{ padding: 16, alignItems: 'center' }}
        cancelTextStyle={{ color: '#e74c3c', fontSize: 16, fontWeight: '600' }}
      />
    );
  };

  const renderRadioField = () => {
    const qAny = field as any;
    const correctAnswer = qAny.correctAnswer;

    return (
      <View style={{ gap: 12 }}>
        {field.options?.map((opt) => {
          const isSelected = value === opt.value;
          let bgColor = '#FFF';
          let borderColor = '#E5E7EB';
          let textColor = '#333';

          if (readOnly) {
            // Se estiver no feedback (somente leitura), mostra verde ou vermelho
            const isCorrectOption =
              correctAnswer !== undefined &&
              String(opt.value).trim().toLowerCase() ===
                String(correctAnswer).trim().toLowerCase();

            if (isCorrectOption) {
              bgColor = '#D1F4E0'; // Verde claro
              borderColor = '#4CAF50';
              textColor = '#2E7D32';
            } else if (isSelected && !isCorrectOption) {
              bgColor = '#FDECEA'; // Vermelho claro
              borderColor = '#F44336';
              textColor = '#C62828';
            }
          } else if (isSelected) {
            // Se estiver respondendo agora e selecionou a opção
            borderColor = '#01738D'; // Sua colors.secundaria
            bgColor = '#F0F7FF';
            textColor = '#01738D';
          }

          return (
            <TouchableOpacity
              key={String(opt.value)}
              style={[
                styles.optionCard,
                { backgroundColor: bgColor, borderColor: borderColor },
              ]}
              onPress={() => !readOnly && onChange(opt.value)}
              disabled={readOnly}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, { color: textColor }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderDateField = () => {
    const dateValue =
      value instanceof Date ? value : value ? new Date(value) : null;

    return (
      <View
        pointerEvents={readOnly ? 'none' : 'auto'}
        style={{ opacity: readOnly ? 0.6 : 1 }}
      >
        <CustomDatePicker
          date={dateValue}
          placeholder={field.placeholder}
          onDateChange={onChange}
          style={[
            styles.input,
            error ? styles.inputError : null,
            { justifyContent: 'center' },
          ]}
          customStyles={{
            dateText: { fontSize: 16, color: '#32323b' },
            placeholderText: { fontSize: 16, color: '#C7C7CD' },
          }}
        />
      </View>
    );
  };

  const renderMultiselectField = () => {
    const selectedValues = Array.isArray(value) ? value : [];

    const toggleOption = (optionValue: string | number) => {
      if (selectedValues.includes(optionValue)) {
        onChange(selectedValues.filter((v: any) => v !== optionValue));
      } else {
        onChange([...selectedValues, optionValue]);
      }
    };

    return (
      <View>
        {field.options?.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <TouchableOpacity
              key={String(option.value)}
              style={styles.checkboxContainer}
              onPress={() => !readOnly && toggleOption(option.value)}
              disabled={readOnly}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  isSelected && styles.checkboxChecked,
                  readOnly && { opacity: 0.6 },
                ]}
              >
                {isSelected && <Text style={styles.checkboxMark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderContent = () => {
    switch (field.type) {
      case 'text':
        return renderTextField();
      case 'number':
        return renderNumberField();
      case 'select':
        return renderSelectField();
      case 'radio':
        return renderRadioField();
      case 'date':
        return renderDateField();
      case 'multiselect':
        return renderMultiselectField();
      case 'boolean':
        return null;
      default:
        return (
          <Text style={{ color: 'red' }}>Tipo desconhecido: {field.type}</Text>
        );
    }
  };

  if (field.type === 'boolean') {
    return (
      <View style={[styles.fieldContainer, containerStyle]}>
        <View style={styles.switchContainer}>
          <Text style={[styles.label, { flex: 1, marginBottom: 0 }]}>
            {field.label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>
          <Switch
            value={!!value}
            onValueChange={onChange}
            disabled={readOnly}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={value ? '#2E97BE' : '#f4f3f4'}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
  return (
    <View
      style={[
        styles.fieldContainer,
        (field.type as string) === 'radio' && { marginBottom: 0 },
        containerStyle,
      ]}
    >
      <Text style={[styles.label, field.type === 'radio' && styles.quizLabel]}>
        {field.label}
        {field.required && <Text style={styles.required}> *</Text>}
      </Text>

      {renderContent()}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
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
    minHeight: 48,
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
    minHeight: 48,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
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
    backgroundColor: '#fff',
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
  quizLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#01738D',
    textAlign: 'center',
  },
  optionCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
