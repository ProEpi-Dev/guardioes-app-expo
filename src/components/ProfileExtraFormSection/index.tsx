import React, { forwardRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getParticipationExtra } from '../../services/finishProfile';
import { FormRenderer } from '../FormRenderer/indexProfile';
import { scale } from '../../utils/scalling';

interface ProfileExtraFormSectionProps {
  onValuesChange: (values: Record<string, unknown>) => void;
  participantCountryLocationId?: number | null;
  lightMode?: boolean;
}

const ProfileExtraFormSection = forwardRef<any, ProfileExtraFormSectionProps>(
  ({ onValuesChange, lightMode }, _ref) => {
    const { data, isLoading } = useQuery({
      queryKey: ['participation-profile-extra-me'],
      queryFn: () => getParticipationExtra(),
    });

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
        <View
          style={[styles.divider, lightMode && { backgroundColor: '#eee' }]}
        />
        <Text style={[styles.title, lightMode && { color: '#333' }]}>
          Informações Adicionais
        </Text>
        <View style={styles.formContainer}>
          <FormRenderer
            key={profileExtra.form.version.id}
            definition={definition}
            initialValues={initialValues}
            onChange={onValuesChange}
            lightText={!lightMode}
          />
        </View>
      </View>
    );
  }
);

ProfileExtraFormSection.displayName = 'ProfileExtraFormSection';

const styles = StyleSheet.create({
  container: { width: '100%' },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: scale(20),
    width: '100%',
  },
  title: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: scale(8),
    textAlign: 'center',
  },
  formContainer: { width: '100%' },
});

export default ProfileExtraFormSection;
