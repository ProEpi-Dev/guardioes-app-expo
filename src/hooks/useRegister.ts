import { useState, useEffect, useRef } from 'react';
import { Alert, Keyboard, TextInput } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { ContextOption, LegalDocument } from '../types/register';
import { getRegisterData } from '../services/register';


export const useRegister = (navigation: any) => {
  const { register } = useAuth();
  const nameInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedContextId, setSelectedContextId] = useState<number | null>(null);
  const [acceptedDocIds, setAcceptedDocIds] = useState<number[]>([]);
  const [contexts, setContexts] = useState<ContextOption[]>([]);
  const [legalDocuments, setLegalDocuments] = useState<LegalDocument[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    Keyboard.dismiss();
    setIsLoadingData(true);
    try {
      const { contexts: ctxs, legalDocuments: docs } = await getRegisterData();
      setContexts(ctxs);
      setLegalDocuments(docs);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao carregar dados iniciais.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const toggleDocument = (doc: LegalDocument) => {
    if (acceptedDocIds.includes(doc.id)) {
      setAcceptedDocIds(prev => prev.filter(id => id !== doc.id));
      return;
    }

    Alert.alert(
      doc.title,
      doc.content,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Li e Aceito", 
          onPress: () => setAcceptedDocIds(prev => [...prev, doc.id]) 
        }
      ]
    );
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    // 1. Validação de Documentos
    const missingDocs = legalDocuments.filter(
      doc => doc.isRequired && !acceptedDocIds.includes(doc.id)
    );
    if (missingDocs.length > 0) {
      Alert.alert("Atenção", "Você precisa aceitar os Termos de Uso e Política de Privacidade para continuar.");
      return;
    }

    // 2. Validação de Campos
    if (!name || !email || !password || password !== confirmPassword) {
      Alert.alert(translate('register.fieldNotBlank'));
      return;
    }

    // 3. Validação de Contexto
    if (!selectedContextId) {
      Alert.alert("Atenção", "Selecione um Contexto.");
      return;
    }

    setIsRegistering(true);

    try {
      const payload = {
        name,
        email,
        password,
        contextId: selectedContextId,
        acceptedLegalDocumentIds: acceptedDocIds
      };

      const result = await register(payload);
      
      if (result.success) {
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', result.error || 'Erro ao realizar cadastro');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao realizar cadastro');
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    nameInput,
    passwordInput,
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    selectedContextId, setSelectedContextId,
    acceptedDocIds,
    contexts,
    legalDocuments,
    isLoadingData,
    isRegistering,
    toggleDocument,
    handleSubmit
  };
};

function translate(arg0: string): string {
    throw new Error('Function not implemented.');
}
