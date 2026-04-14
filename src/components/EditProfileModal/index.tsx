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
} from '../../services/finishProfile';
import { CustomSelector } from '../SnowForms';
import { DropdownOption } from '../../types/finishProfile';
import { percentage } from '../../utils/scalling';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProfileModal({ visible, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [genders, setGenders] = useState<DropdownOption[]>([]);
  const [locations, setLocations] = useState<DropdownOption[]>([]);

  const [selectedGenderId, setSelectedGenderId] = useState<number | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [externalIdentifier, setExternalIdentifier] = useState('');

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
    if (!selectedGenderId || !selectedLocationId || !externalIdentifier) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile({
        genderId: selectedGenderId,
        locationId: selectedLocationId,
        externalIdentifier,
      });

      Alert.alert('Dados atualizados!');
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
      <View style={styles.container}>
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

            <Text style={styles.label}>Matrícula / Identificador</Text>
            <TextInput
              style={styles.input}
              value={externalIdentifier}
              onChangeText={setExternalIdentifier}
              placeholder="Digite sua matrícula"
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
