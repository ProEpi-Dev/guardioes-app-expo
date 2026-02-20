import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contexts/AuthContext';
import { updateUser as updateUserApi } from '../../../services/user';
import { EditProfileModal } from '../../../components/EditProfileModal';
import { styles } from './styles';
import { ChangePasswordModal } from '../../../components/ChangePasswordModal';

export default function ProfileScreen() {
  const { user, updateUserLocal } = useAuth(); 
  
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showChangePasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || ''); 
      setEmail(user.email || ''); 
    }
  }, [user]);

  const handleSaveBasicInfo = async () => {
    if (!user?.id) return;
    if (!name.trim() || !email.trim()) {
      Alert.alert("Erro", "Nome e Email são obrigatórios");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "O campo Nova Senha e Confirme a nova Senha possuem valores diferentes");
      return;
    }
    
    if (password.length <= 5) {
      Alert.alert("Erro", "A nova senha deve ter mínimo de 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const payload: any = { name, email };
      
      if (isChangingPassword && password.trim().length > 0) {
        payload.password = password;
      }

      await updateUserApi(user.id, payload);
      
      if (updateUserLocal) {
          await updateUserLocal({ ...user, name, email });
      }

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setIsEditingBasic(false);
      setIsChangingPassword(false);
      setPassword(''); 
      setConfirmPassword('')
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cabeçalho */}
        <View style={styles.headerProfile}>          
          <View style={styles.avatarContainer}>
            <Feather name="user" size={40} color="#348eac" />
          </View>
          
          <Text style={styles.headerName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.headerEmail}>{user?.email || 'email@exemplo.com'}</Text>
        </View>

        {/* Seção 1: Dados Básicos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
            {!isEditingBasic && (
              <TouchableOpacity onPress={() => setIsEditingBasic(true)}>
                <Text style={styles.editLink}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput 
              style={[styles.input, !isEditingBasic && styles.disabledInput]}
              value={name}
              onChangeText={setName}
              editable={isEditingBasic}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={[styles.input, !isEditingBasic && styles.disabledInput]}
              value={email}
              onChangeText={setEmail}
              editable={isEditingBasic}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {isEditingBasic && (
            <View style={styles.passwordContainer}>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setIsEditingBasic(false);
                    setIsChangingPassword(false);
                    setName(user?.name || '');
                    setEmail(user?.email || '');
                  }}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleSaveBasicInfo}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Salvar</Text>}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Seção 2: Dados Complementares */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alterar Senha</Text>
          <Text style={styles.sectionDescription}>
            Senha Atual, Nova Senha e Confirme sua senha
          </Text>
          
          <TouchableOpacity 
            style={styles.editDetailsButton}
            onPress={() => setShowPasswordModal(true)}
          >
            <Feather name="edit-3" size={20} color="#348eac" />
            <Text style={styles.editDetailsText}>Atualizar Senha</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Complementares</Text>
          <Text style={styles.sectionDescription}>
            Gênero, Localização e Matrícula.
          </Text>
          
          <TouchableOpacity 
            style={styles.editDetailsButton}
            onPress={() => setShowDetailsModal(true)}
          >
            <Feather name="edit-3" size={20} color="#348eac" />
            <Text style={styles.editDetailsText}>Editar Dados do Perfil</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <EditProfileModal 
        visible={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)}
        onSuccess={() => {
          //  console.log("Dados complementares atualizados");
        }}
      />

      <ChangePasswordModal 
        visible={showChangePasswordModal} 
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          //  console.log("Dados complementares atualizados");
        }}
      />

    </SafeAreaView>
  );
}