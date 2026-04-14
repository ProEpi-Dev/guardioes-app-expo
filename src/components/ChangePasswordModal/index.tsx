import React, { useState } from 'react';
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
import { updatePassword } from '../../services/finishProfile';
import { percentage } from '../../utils/scalling';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangePasswordModal({ visible, onClose, onSuccess }: Props) {
  const [loading, _setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const handleSave = async () => {
    if (!currentPassword || !password || !confirmPassword) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'A nova senha e a confirmação devem ser iguais.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Senha inválida',
        'A nova senha deve ter no mínimo 8 caracteres, contendo pelo menos uma letra minúscula, uma maiúscula e um número.'
      );
      return;
    }

    try {
      setSaving(true);
      await updatePassword({
        currentPassword: currentPassword,
        newPassword: password,
      });

      Alert.alert('Senha atualizada');
      onSuccess();
      onClose();
    } catch (error: any) {
      const serverMessage = error.data?.error?.message;
      let displayMessage = 'Falha ao atualizar a senha.';

      if (Array.isArray(serverMessage)) {
        displayMessage = serverMessage.join('\n');
      } else if (typeof serverMessage === 'string') {
        displayMessage = serverMessage;
      }

      Alert.alert('Erro', displayMessage);
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
          <Text style={styles.title}>Alterar Senha</Text>
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
            <Text style={styles.label}>Senha Atual</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Digite sua senha atual"
            />
            <Text style={styles.label}>Nova Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
            />
            <Text style={styles.label}>Confirma a sua nova senha</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirme sua senha"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveText}>Alterar senha</Text>
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
