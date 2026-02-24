import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { QuizResultParams } from '../types/quizResultParams';

export const useResultNavigation = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as QuizResultParams;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handleReturnToHome = () => {
    const state = navigation.getState();
    
    // Procura o índice da tela da Trilha no histórico de navegação
    const targetRouteIndex = state?.routes?.findIndex((r: any) => r.name === 'Accordion');
    
    // Se a trilha está no histórico
    if (targetRouteIndex !== undefined && targetRouteIndex !== -1) {
      // Calcula quantas telas precisamos "estourar" para voltar pra ela
      const popCount = state.routes.length - 1 - targetRouteIndex;
      
      if (popCount > 0) {
        navigation.pop(popCount); // Remove as telas da frente
      }
    } else {
      // Se por acaso não veio da trilha, volta pro início normalmente
      navigation.popToTop(); 
    }
  };

  return {
    params,
    handleReturnToHome
  };
};