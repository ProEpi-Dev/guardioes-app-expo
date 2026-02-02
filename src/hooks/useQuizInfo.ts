import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { QuizInfoRouteParams } from '../types/quizInfoRouteParams';
import { getContentById } from '../services/contents';

type QuizzInfoScreenRouteProp = RouteProp<{ params: QuizInfoRouteParams }, 'params'>;

export const useQuizInfo = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<QuizzInfoScreenRouteProp>();
  
  const { 
    quizId, 
    title, 
    currentAttempt, 
    linkedArticle, 
    maxAttempts, 
    timeLimitMinutes,
    trackProgressId,
    sequenceId,
    passingScore
  } = route.params;

  const [loadingContent, setLoadingContent] = useState(false);

  const handleStartQuiz = () => {
    navigation.navigate('QuizzQuestionsScreen', { 
      quizId, 
      title, 
      timeLimitMinutes,
      trackProgressId,
      sequenceId
    });
  };

  const handleGoToContent = async () => {
    if (!linkedArticle || !linkedArticle.id) {
      return Alert.alert("Indisponível", "Não há material de leitura vinculado a este quiz.");
    }

    try {
      setLoadingContent(true);
      
      const fullArticle = await getContentById(linkedArticle.id);

      if (!fullArticle || !fullArticle.content) {
        throw new Error("Conteúdo vazio");
      }

      navigation.navigate('Article', { article: fullArticle });

    } catch (error) {
      console.error("Erro ao buscar artigo:", error);
      Alert.alert("Erro", "Não foi possível carregar o conteúdo completo. Verifique sua conexão.");
    } finally {
      setLoadingContent(false);
    }
  };

  return {
    title,
    currentAttempt,
    maxAttempts,
    timeLimitMinutes,
    linkedArticle,
    loadingContent,
    handleStartQuiz,
    handleGoToContent,
    passingScore
  };
};