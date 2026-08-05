import { useEffect, useState } from 'react';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

export function useConnection() {
  const [loading, setLoading] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    // remove o listener caso o componente App seja desmontado
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const networkState = await NetInfo.fetch();
        if (!networkState.isConnected) {
          console.log('O aparelho do usuário está sem internet.');
          return;
        }
        try {
          await axios.get(
            `${process.env.EXPO_PUBLIC_API_BASE_URL}/v1/endpoint-inexistente-teste`
          );
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              console.log('API Online e respondendo perfeitamente.');
            } else {
              console.log('O usuário tem internet, mas nosso servidor caiu!');
              setIsMaintenance(true);
            }
          } else {
            console.error('Erro desconhecido ao testar a API:', error);
            setIsMaintenance(true);
          }
        }
      } catch (error) {
        console.error('Erro geral na inicialização do App:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  return {
    loading,
    isMaintenance,
    isOffline,
  };
}
