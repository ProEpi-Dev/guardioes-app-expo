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
    navigation.popToTop(); 
  };

  return {
    params,
    handleReturnToHome
  };
};