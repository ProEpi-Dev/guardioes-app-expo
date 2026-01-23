import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useTrailNavigation = () => {
  const navigation = useNavigation<any>();

  const handleQuizPress = (seqItem: any) => {
    if (!seqItem.active) return;

    if (seqItem.isPassed) {
      Alert.alert(
        'Parabéns!',
        `Você já foi aprovado neste quiz!\n\nNota: ${seqItem.score}\nTentativas: ${seqItem.attemptNumber}\nSituação: Aprovado`
      );
      return;
    }

    if (seqItem.maxAttempts && seqItem.attemptNumber && seqItem.attemptNumber >= seqItem.maxAttempts) {
      Alert.alert(
        'Tentativas Esgotadas',
        `Você atingiu o limite de tentativas.\n\nNota: ${seqItem.score}\nSituação: Reprovado\nTentativas: ${seqItem.attemptNumber}/${seqItem.maxAttempts}`
      );
      return;
    }

    navigation.navigate('QuizzInfoScreen', {
      quizId: seqItem.form.id,
      title: seqItem.form.title,
      currentAttempt: (seqItem.attemptNumber || 0) + 1,
      linkedArticle: null,
      maxAttempts: seqItem.maxAttempts,
      timeLimitMinutes: seqItem.timeLimitMinutes
    });
  };

  const handleArticlePress = (content: any) => {
    navigation.navigate('Article', { article: content });
  };

  return { handleQuizPress, handleArticlePress };
};