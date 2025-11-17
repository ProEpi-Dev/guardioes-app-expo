import React, { useState } from 'react';
import { StatusBar, Alert, View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapWithFeeling } from '../../../components/MapWithFeeling';
import { FormRenderer } from '../../../components/FormRenderer';
import { useAuth } from '../../../contexts/AuthContext';
import { authenticatedApiClient } from '../../../utils/api';
import { FormVersion } from '../../../types/form';
import Feather from '@expo/vector-icons/Feather';

const azul = '#2E97BE';

export function MapaSentimento() {
  const { form, token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formDefinition, setFormDefinition] = useState<any>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [loadingForm, setLoadingForm] = useState(false);

  const fetchFormVersion = async () => {
    if (!form || !token) {
      Alert.alert('Erro', 'Formulário não disponível');
      return;
    }

    setLoadingForm(true);
    try {
      // Buscar versões do form
      const response = await authenticatedApiClient(
        `/v1/forms/${form.id}/versions?page=1&pageSize=1&active=true`,
        token,
        { method: 'GET' }
      ) as any;

      if (response.data && response.data.length > 0) {
        const formVersion: FormVersion = response.data[0];
        if (formVersion.definition) {
          setFormDefinition(formVersion.definition);
          setShowForm(true);
        } else {
          Alert.alert('Erro', 'Definição do formulário não encontrada');
        }
      } else {
        Alert.alert('Erro', 'Nenhuma versão do formulário disponível');
      }
    } catch (error: any) {
      console.error('Erro ao buscar versão do form:', error);
      Alert.alert('Erro', 'Não foi possível carregar o formulário');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleFeelingSelected = async (feeling: 'good' | 'bad') => {
    if (feeling === 'good') {
      // Se selecionou BEM, apenas registra
      Alert.alert(
        'Sentimento registrado',
        'Você selecionou: BEM',
        [{ text: 'OK' }]
      );
      // TODO: Implementar chamada à API para salvar o sentimento
    } else {
      // Se selecionou MAL, busca e mostra o formulário
      await fetchFormVersion();
    }
  };

  const handleFormChange = (values: Record<string, any>) => {
    setFormValues(values);
  };

  const handleSubmitForm = async () => {
    if (!formValues._isValid) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (!token || !form) {
      Alert.alert('Erro', 'Não foi possível enviar o formulário');
      return;
    }

    try {
      const { _isValid, ...cleanFormResponse } = formValues;
      
      // TODO: Implementar chamada à API para criar o report
      // await authenticatedApiClient('/v1/reports', token, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     formVersionId: formVersionId,
      //     formResponse: cleanFormResponse,
      //     reportType: 'POSITIVE',
      //   }),
      // });

      Alert.alert('Sucesso', 'Formulário enviado com sucesso!');
      setShowForm(false);
      setFormValues({});
      setFormDefinition(null);
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      Alert.alert('Erro', 'Não foi possível enviar o formulário');
    }
  };

  // Se estiver mostrando o formulário, renderizar tela cheia
  if (showForm) {
    return (
      <SafeAreaView style={styles.formContainer}>
        <StatusBar backgroundColor={azul} barStyle="light-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.formHeader}>
            <View style={styles.placeholder} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowForm(false);
                setFormValues({});
                setFormDefinition(null);
              }}
            >
              <Feather name="x" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {loadingForm ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando formulário...</Text>
            </View>
          ) : formDefinition ? (
            <>
              <View style={styles.formContent}>
                <FormRenderer
                  definition={formDefinition}
                  onChange={handleFormChange}
                />
              </View>
              <View style={styles.formFooter}>
                <TouchableOpacity
                  style={[styles.footerButton, styles.cancelButton]}
                  onPress={() => {
                    setShowForm(false);
                    setFormValues({});
                    setFormDefinition(null);
                  }}
                >
                  <Text style={styles.footerButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.footerButton, styles.submitButton]}
                  onPress={handleSubmitForm}
                >
                  <Text style={styles.footerButtonText}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Tela normal com mapa
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: azul }}>
      <StatusBar backgroundColor={azul} barStyle="light-content" />
      <MapWithFeeling onFeelingSelected={handleFeelingSelected} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: azul,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
    minHeight: 56,
  },
  placeholder: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContent: {
    flex: 1,
    padding: 16,
  },
  formFooter: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: azul,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

