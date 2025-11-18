import React, { useEffect, useState } from 'react';
import { StatusBar, Alert, View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapWithFeeling } from '../../../components/MapWithFeeling';
import { FormRenderer } from '../../../components/FormRenderer';
import { useAuth } from '../../../contexts/AuthContext';
import { authenticatedApiClient } from '../../../utils/api';
import Feather from '@expo/vector-icons/Feather';
import * as Location from 'expo-location';

const azul = '#2E97BE';

export function MapaSentimento() {
  const { form, token, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formDefinition, setFormDefinition] = useState<any>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentFormVersionId, setCurrentFormVersionId] = useState<number | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [participationId, setParticipationId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        let currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
        });
        setLocation(currentLocation);
      } catch (error) {
      }
    })();
  }, []);


  useEffect(() => {
    const fetchIds = async () => {
      if (!token || !user?.email) return;

      try {
        const usersResponse = await authenticatedApiClient(
          '/v1/users?page=1&pageSize=100',
          token, { method: 'GET' }
        ) as any;

        const usersList = usersResponse.data || usersResponse;
        const loggedUser = usersList.find((u: any) => u.email === user.email);

        if (!loggedUser) {
          console.warn(`Usuário com email ${user.email} não encontrado na lista.`);
          return;
        }

        const myUserId = loggedUser.id;

        const participationsResponse = await authenticatedApiClient(
          '/v1/participations?page=1&pageSize=100',
          token, { method: 'GET' }
        ) as any;

        const participationsList = participationsResponse.data || participationsResponse;
        const myParticipation = participationsList.find((p: any) => p.userId === myUserId && p.active === true);

        if (myParticipation) {
          setParticipationId(myParticipation.id);
        } else {
          console.warn(`Nenhuma participação ativa encontrada para o UserID ${myUserId}`);
        }

      } catch (error) {
        console.error('Erro ao vincular usuário/participação:', error);
      }
    };

    fetchIds();
  }, [token, user?.email]);

  const fetchFormVersion = async () => {
    if (!form || !token) {
      Alert.alert('Erro', 'Formulário não disponível');
      return;
    }

    setLoadingForm(true);
    try {
      const formIdParaBusca = form.id;

      const response = await authenticatedApiClient(
        `/v1/forms/${formIdParaBusca}/versions?page=1&pageSize=1&active=true`, 
        token,
        { method: 'GET' }
      ) as any;

      if (response.data && response.data.length > 0) {
        const latestVersion = response.data[0];

        if (latestVersion.definition) {
          setFormDefinition(latestVersion.definition);
          setCurrentFormVersionId(latestVersion.id); 
          setShowForm(true);
        } else {
          Alert.alert('Erro', 'Definição do formulário não encontrada.');
        }
      } else {
        Alert.alert('Aviso', 'Nenhuma versão ativa deste formulário está disponível.');
      }
    } catch (error: any) {
      console.error('Erro ao buscar formulário:', error);
      Alert.alert('Erro', 'Falha ao carregar o formulário.');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleFeelingSelected = async (feeling: 'good' | 'bad') => {
    let currentLocation = location;
    if (!currentLocation) {
      try {
        currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation(currentLocation);
      } catch (e) {
      }
    }
    
    if (!participationId) {
        Alert.alert('Aguarde', 'Identificando usuário...');
        return;
    }

    if (feeling === 'good') {
      try {
        const formIdParaBusca = form?.formId || form?.id;
        
        const resp = await authenticatedApiClient(
          `/v1/forms/${formIdParaBusca}/versions?page=1&pageSize=1&active=true`,
          token,
          { method: 'GET' }
        ) as any;

        if (!resp.data || resp.data.length === 0) {
          Alert.alert('Erro', 'Configuração não encontrada.');
          return;
        }

        const versionId = resp.data[0].id;

        const payload = {
          participationId: participationId,
          formVersionId: versionId,
          reportType: 'POSITIVE',
          formResponse: {},
          occurrenceLocation: currentLocation ? {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude
          } : null 
        };

        await authenticatedApiClient('/v1/reports', token, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' }
        });

        Alert.alert('Registrado', 'Que bom que você está se sentindo bem!');

      } catch (error) {
        console.error('Erro envio positivo:', error);
        Alert.alert('Erro', 'Não foi possível registrar seu sentimento.');
      }
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
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (!token || !currentFormVersionId || !participationId) {
      Alert.alert('Erro', 'ID do usuário não identificado.');
      return;
    }

    let finalLocation = location;
    if (!finalLocation) {
       try {
         finalLocation = await Location.getCurrentPositionAsync({});
         setLocation(finalLocation);
       } catch (e) {
       }
    }

    setSending(true);

    try {
      const { _isValid, ...cleanFormResponse } = formValues;
      
      const payload = {
        participationId: participationId,
        formVersionId: currentFormVersionId,
        reportType: 'NEGATIVE',
        formResponse: cleanFormResponse,
        occurrenceLocation: finalLocation ? {
            latitude: finalLocation.coords.latitude,
            longitude: finalLocation.coords.longitude
        } : null
      };

      await authenticatedApiClient('/v1/reports', token, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });

      Alert.alert('Sucesso', 'Formulário enviado com sucesso!');
      
      setShowForm(false);
      setFormValues({});
      setFormDefinition(null);
      setCurrentFormVersionId(null);

    } catch (error: any) {
      console.error('Erro envio formulário:', error);
      Alert.alert('Erro', 'Não foi possível enviar o formulário.');
    } finally {
        setSending(false);
    }
  };

  // Se estiver mostrando o formulário, renderizar tela cheia
  if (showForm) {
    return (
      <SafeAreaView style={styles.formContainer}>
        <StatusBar backgroundColor={azul} barStyle="light-content" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
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
              <ActivityIndicator size="large" color={azul} />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : formDefinition ? (
            <>
              <View style={styles.formContent}>
                <FormRenderer definition={formDefinition} onChange={handleFormChange} />
              </View>
              <View style={styles.formFooter}>
                <TouchableOpacity
                  style={[styles.footerButton, styles.cancelButton]}
                  onPress={() => setShowForm(false)}
                  disabled={sending}
                >
                  <Text style={styles.footerButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.footerButton, styles.submitButton]}
                  onPress={handleSubmitForm}
                  disabled={sending}
                >
                  {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.footerButtonText}>Enviar</Text>}
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

