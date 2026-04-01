import { useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { forgotPassword } from '../services/passwordRecover';

export const usePasswordRecover = () => {
  const navigation = useNavigation<any>();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, insira seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      
      Alert.alert(
        "Recuperação de Senha",
        "Se o email informado estiver cadastrado, você receberá o email para redefinição de senha",
        [{ text: "OK", onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu uma falha ao processar a solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    handleSubmit,
    navigation // Retornamos navigation para o botão de voltar
  };
};