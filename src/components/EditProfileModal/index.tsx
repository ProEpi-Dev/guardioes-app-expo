import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  getGenders,
  getLocations,
  getProfileStatus,
  updateUserProfile,
  putParticipationExtra,
} from '../../services/finishProfile';
import { CustomSelector } from '../SnowForms';
import { DropdownOption } from '../../types/finishProfile';
import { percentage } from '../../utils/scalling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import ProfileExtraFormSection from '../ProfileExtraFormSection';
import { resolveProfileExtraPayload } from '../../utils/profileExtraPayload';
import { useAuth } from '../../contexts/AuthContext';
import { getIdentifierStrategy } from '../../utils/identifierStrategy';
import translate from '../../locales/i18n';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProfileModal({ visible, onClose, onSuccess }: Props) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [genders, setGenders] = useState<DropdownOption[]>([]);
  const [locations, setLocations] = useState<DropdownOption[]>([]);

  const [selectedGenderId, setSelectedGenderId] = useState<number | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [externalIdentifier, setExternalIdentifier] = useState('');
  const [phone, setPhone] = useState<string | ''>('');
  const [isStudent, setIsStudent] = useState<boolean | null>(null);

  const extraValuesRef = React.useRef<Record<string, unknown>>({});
  const queryClient = useQueryClient();

  const insets = useSafeAreaInsets();

  const isUnb =
    user?.participation?.context?.name?.toLowerCase().includes('unb') || false;
  const identifierStrategy = React.useMemo(() => {
    if (isUnb && isStudent === true) {
      return getIdentifierStrategy('unb_student');
    }
    return getIdentifierStrategy('default');
  }, [isUnb, isStudent]);

  const studentOptions: DropdownOption[] = React.useMemo(() => [
    { key: 'yes', label: translate('finishProfile.identifier.studentSelector.yes'), value: true },
    { key: 'no', label: translate('finishProfile.identifier.studentSelector.no'), value: false },
  ], []);

  // Limpar identificador ao trocar o tipo de estudante
  React.useEffect(() => {
    if (isStudent !== null) {
      setExternalIdentifier('');
    }
  }, [isStudent]);

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    try {
      setLoading(true);
      const status = await getProfileStatus();
      if (status?.profile) {
        setSelectedGenderId(status.profile.genderId ?? null);
        setSelectedLocationId(status.profile.locationId ?? null);
        setExternalIdentifier(status.profile.externalIdentifier || '');
        setPhone(status.profile.phone || '');
      }
      const [rawGenders, rawLocations] = await Promise.all([
        getGenders(),
        getLocations(),
      ]);
      setGenders(
        rawGenders
          .filter((g: any) => g.active)
          .map((g: any) => ({ key: g.id, label: g.name, value: g.id }))
      );
      setLocations(
        rawLocations
          .filter((l: any) => l.active)
          .map((l: any) => ({ key: l.id, label: l.name, value: l.id }))
      );
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (
      !selectedGenderId ||
      !selectedLocationId ||
      !externalIdentifier ||
      !phone
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos básicos.');
      return;
    }

    const error = identifierStrategy.validate(externalIdentifier);
    if (error) {
      Alert.alert('Atenção', error);
      return; // Interrompe o salvamento
    }

    try {
      setSaving(true);

      await updateUserProfile({
        genderId: selectedGenderId,
        locationId: selectedLocationId,
        externalIdentifier,
        phone: phone,
      });

      const profileExtraData: any = queryClient.getQueryData([
        'participation-profile-extra-me',
      ]);
      const profileExtra = Array.isArray(profileExtraData)
        ? profileExtraData[0]
        : profileExtraData;

      if (profileExtra?.form) {
        const resolved = resolveProfileExtraPayload(
          profileExtra,
          extraValuesRef.current
        );

        if ('error' in resolved) {
          Alert.alert(
            'Atenção',
            'Verifique os campos obrigatórios nas informações adicionais.'
          );
          setSaving(false);
          return;
        }

        await putParticipationExtra({
          formVersionId: profileExtra.form.version.id,
          formResponse: resolved.ok,
        });

        queryClient.invalidateQueries({
          queryKey: ['participation-profile-extra-me'],
        });
      }

      Alert.alert('Sucesso', 'Dados atualizados!');
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Dados Complementares</Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ marginTop: 50 }}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.label}>Sexo</Text>
            <CustomSelector
              lightMode={true}
              data={genders}
              initValue={selectedGenderId}
              placeholder="Selecione seu Sexo"
              onChange={(item: DropdownOption) =>
                setSelectedGenderId(Number(item.value))
              }
            />

            <Text style={styles.label}>Localização (Campus/Unidade)</Text>
            <CustomSelector
              lightMode={true}
              data={locations}
              initValue={selectedLocationId}
              onChange={(item: DropdownOption) =>
                setSelectedLocationId(Number(item.value))
              }
              placeholder="Selecione sua localização"
            />

            {/* SELETOR ESTUDANTE UNB */}
            {isUnb && (
              <>
                <Text style={styles.label}>{translate('finishProfile.identifier.studentSelector.label')}</Text>
                <CustomSelector
                  lightMode={true}
                  data={studentOptions}
                  initValue={isStudent}
                  placeholder={translate('finishProfile.identifier.studentSelector.placeholder')}
                  onChange={(item: DropdownOption) => setIsStudent(item.value as boolean)}
                />
              </>
            )}

            {/* IDENTIFICADOR - só aparece após selecionar tipo (para UnB) ou diretamente (para outros) */}
            {(!isUnb || isStudent !== null) && (
              <>
                <Text style={styles.label}>{identifierStrategy.label}</Text>
                <TextInput
                  style={styles.input}
                  value={externalIdentifier}
                  onChangeText={setExternalIdentifier}
                  placeholder={identifierStrategy.placeholder}
                />
              </>
            )}

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Digite seu telefone"
            />
            <ProfileExtraFormSection
              lightMode={true}
              onValuesChange={(v) => {
                extraValuesRef.current = v;
              }}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveText}>Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 0,
    marginTop: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: percentage(4),
  },
  saveButton: {
    backgroundColor: '#348eac',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
