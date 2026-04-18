import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';

// Ajuste os caminhos de importação conforme sua estrutura de pastas
import { getParticipationExtra } from '../../services/finishProfile';
import { FormRenderer } from '../FormRenderer';
import { scale } from '../../utils/scalling';

interface ProfileExtraFormSectionProps {
  onValuesChange: (values: Record<string, unknown>) => void;
  participantCountryLocationId?: number | null;
}

const ProfileExtraFormSection = forwardRef<any, ProfileExtraFormSectionProps>(
  // Correção 3: Removendo participantCountryLocationId da desestruturação pois não está sendo usado
  ({ onValuesChange }, _ref) => {
    const { data, isLoading } = useQuery({
      queryKey: ['participation-profile-extra-me'],
      queryFn: () => getParticipationExtra(),
    });

    // Como na sua API mobile os dados costumam vir como Array, acessamos data[0]
    const profileExtra = Array.isArray(data) ? data[0] : data;

    if (isLoading || !profileExtra?.form) {
      return null;
    }

    const definition = profileExtra.form.version.definition;
    const initialValues =
      profileExtra.submission?.formVersionId === profileExtra.form.version.id
        ? { ...profileExtra.submission.response }
        : {};

    return (
      <View style={styles.container}>
        <View style={styles.divider} />

        <Text style={styles.title}>Informações Adicionais</Text>
        <Text style={styles.subtitle}>
          Preencha os dados extras do seu perfil
        </Text>

        <View style={styles.formContainer}>
          <FormRenderer
            // Correção 1: Removido o ref={ref} pois FormRenderer ainda não aceita refs
            key={profileExtra.form.version.id}
            definition={definition}
            initialValues={initialValues}
            onChange={onValuesChange}
          />
        </View>
      </View>
    );
  }
);

// Correção 2: Adicionado displayName para remover o aviso do ESLint react/display-name
ProfileExtraFormSection.displayName = 'ProfileExtraFormSection';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Linha divisória sutil
    marginVertical: scale(20),
    width: '100%',
  },
  title: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: scale(8),
  },
  subtitle: {
    fontSize: scale(14),
    color: '#e0e0e0', // Cor ligeiramente mais opaca para subtítulo
    marginBottom: scale(20),
  },
  formContainer: {
    width: '100%',
  },
});

export default ProfileExtraFormSection;
