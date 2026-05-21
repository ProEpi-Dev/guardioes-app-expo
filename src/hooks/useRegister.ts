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
        return prev.filter((id) => id !== doc.id);
      } else {
        return [...prev, doc.id];
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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Senha inválida',
        'A nova senha deve ter no mínimo 8 caracteres, contendo pelo menos uma letra minúscula, uma maiúscula e um número.'
      );
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
        Alert.alert(
          'Quase lá!',
          `Enviamos um e-mail de ativação para o endereço ${email}. Verifique sua caixa de entrada e spam para confirmar seu cadastro.`,
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('EmailConfirmation', { email }),
            },
          ]
        );
      } else {
        let errorMessage =
          'Não foi possível realizar o cadastro. Verifique os dados e tente novamente.';
        if (typeof result?.error === 'string' && result.error.trim() !== '') {
          try {
            const parsedError = JSON.parse(result.error);
            errorMessage =
              parsedError?.data?.error?.message ||
              parsedError?.message ||
              result.error;
          } catch {
            errorMessage = result.error;
          }
        } else if (result?.data) {
          const resData = result.data as any;
          if (resData?.error?.message) {
            errorMessage = resData.error.message;
          }
        }
        Alert.alert('Atenção', errorMessage);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.data?.error?.message ||
        'Erro inesperado ao realizar o cadastro. Tente novamente mais tarde.';

      Alert.alert('Erro no Cadastro', errorMessage);
      console.log('Detalhes do erro:', error);
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
