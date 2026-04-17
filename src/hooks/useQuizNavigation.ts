import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Quizes } from '../types/quiz';

export const useQuizNavigation = () => {
  const navigation = useNavigation<any>();

  const handleCardPress = (item: Quizes) => {
    if (item.isPassed) {
      Alert.alert(
        'Parabéns!',
        `Você já foi aprovado neste quiz!\n\nNota: ${item.score}\nTentativas: ${item.attemptNumber}\nSituação: Aprovado`
      );
      return;
    }

    if (
      item.maxAttempts &&
      item.attemptNumber &&
      item.attemptNumber >= item.maxAttempts
    ) {
      Alert.alert(
        'Tentativas Esgotadas',
        `Você atingiu o limite de tentativas.\n\nNota: ${item.score}\nSituação: Reprovado\nTentativas: ${item.attemptNumber}/${item.maxAttempts}`
      );
      return;
    }

    navigation.navigate('QuizzInfoScreen', {
      quizId: item.id,
      title: item.title,
      currentAttempt: (item.attemptNumber || 0) + 1,
      linkedArticle: item.linkedArticle,
      maxAttempts: item.maxAttempts,
      timeLimitMinutes: item.timeLimitMinutes,
    });
  };

  return { handleCardPress };
};
