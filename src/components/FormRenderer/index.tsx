import React from 'react';
import { ScrollView, Text, StatusBar } from 'react-native';
import { useForm } from '../../hooks/useForm';
import { FieldFactory } from './FieldFactory';
import { styles } from './styles';
import { FormRendererProps } from '../../types/formRenderer';

export const FormRenderer: React.FC<FormRendererProps> = (props) => {
  const { definition, readOnly = false } = props;
  const { 
    values, 
    errors, 
    visibleFields, 
    updateValue 
  } = useForm(props);

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

        {visibleFields.map((field) => (
          <FieldFactory
            key={field.id}
            field={field}
            value={values[field.name]}
            error={errors[field.id]}
            readOnly={readOnly}
            onChange={(val) => updateValue(field.name, val)}
          />
        ))}
      </ScrollView>
    </>
  );
};