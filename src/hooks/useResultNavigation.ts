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
    const isFromTrail = state?.routes?.some((r: any) => r.name === 'Accordion');
    
    if (isFromTrail) {
      navigation.navigate('Accordion');
    } else {
      navigation.popToTop(); 
    }
  };

  return {
    params,
    handleReturnToHome
  };
};