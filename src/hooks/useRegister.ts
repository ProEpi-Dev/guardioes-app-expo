import { useState, useEffect, useRef } from 'react';
import { Alert, Keyboard, TextInput } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { ContextOption, LegalDocument } from '../types/register';
import { getRegisterData } from '../services/register';

function translate(arg0: string): string {
  return arg0;
}

export const useRegister = (navigation: any) => {
  const { register } = useAuth();
  const nameInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedContextId, setSelectedContextId] = useState<number | null>(
    null
  );
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
      Alert.alert('Erro', 'Falha ao carregar dados iniciais.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const toggleDocument = (doc: LegalDocument) => {
    setAcceptedDocIds((prev) => {
      if (prev.includes(doc.id)) {
        return prev.filter((id) => id !== doc.id); // Desmarca
      } else {
        return [...prev, doc.id]; // Marca
      }
    });
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    const missingDocs = legalDocuments.filter(
      (doc) => doc.isRequired && !acceptedDocIds.includes(doc.id)
    );

    if (missingDocs.length > 0) {
      Alert.alert(
        'Atenção',
        'Você precisa aceitar os Termos de Uso e Política de Privacidade para continuar.'
      );
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(translate('Campos obrigatórios não preenchidos'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(translate('Senha e Confirmar Senha devem ser iguais'));
      return;
    }

    if (!selectedContextId) {
      Alert.alert('Atenção', 'Selecione um Contexto.');
      return;
    }

    setIsRegistering(true);

    try {
      const payload = {
        name,
        email,
        password,
        contextId: selectedContextId,
        acceptedLegalDocumentIds: acceptedDocIds,
      };

      const result = await register(payload);

      if (result.success) {
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', result.error || 'Erro ao realizar cadastro');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao realizar cadastro');
      console.log(error);
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    nameInput,
    passwordInput,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    selectedContextId,
    setSelectedContextId,
    acceptedDocIds,
    contexts,
    legalDocuments,
    isLoadingData,
    isRegistering,
    toggleDocument,
    handleSubmit,
  };
};
