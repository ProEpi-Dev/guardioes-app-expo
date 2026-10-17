import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Quizes } from '../types/quiz';
import {
  getActiveQuizzes,
  getContentQuizMapping,
  getUserSubmissions,
} from '../services/quiz';

/**
 * Resultado do usuário para o quiz, em qualquer versão do formulário: quando a
 * coordenação publica uma versão nova, quem respondeu a anterior não pode voltar
 * a ver o quiz como não feito. Prioriza o envio aprovado; sem aprovação, o mais
 * recente (a lista já vem do mais recente para o mais antigo).
 */
const findUserResult = (submissions: any[], quiz: any) => {
  const versionId = quiz.latestVersion?.id;
  const ofQuiz = submissions.filter(
    (res: any) =>
      res.formVersion?.form?.id === quiz.id || res.formVersionId === versionId
  );
  return ofQuiz.find((res: any) => res.isPassed) || ofQuiz[0];
};

export const useQuizList = (participationId: number | null) => {
  const [content, setContent] = useState<Quizes[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const lastFetchTime = useRef<number>(0);
  const CACHE_DURATION = 60 * 1000;

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (!participationId) return;

      const now = Date.now();
      if (
        !isRefresh &&
        now - lastFetchTime.current < CACHE_DURATION &&
        content.length > 0
      ) {
        return;
      }

      try {
        if (!isRefresh) setLoading(true);
        else setRefreshing(true);

        const [quizzesData, submissionsData, contentMappingData] =
          await Promise.all([
            getActiveQuizzes(),
            getUserSubmissions(participationId),
            getContentQuizMapping(),
          ]);

        const mergedContent = quizzesData.map((quiz: any) => {
          const userResult = findUserResult(submissionsData, quiz);

          const linkedContentRelation = contentMappingData.find(
            (relation: any) => String(relation.formId) === String(quiz.id)
          );

          const baseQuiz = {
            ...quiz,
            passingScore: quiz.latestVersion?.passingScore,
            maxAttempts: quiz.latestVersion?.maxAttempts,
            timeLimitMinutes: quiz.latestVersion?.timeLimitMinutes,
            linkedArticle: linkedContentRelation
              ? linkedContentRelation.content
              : null,
          };

          if (userResult) {
            return {
              ...baseQuiz,
              score: userResult.score,
              isPassed: userResult.isPassed,
              attemptNumber: userResult.attemptNumber,
            };
          }

          return baseQuiz;
        });

        setContent(mergedContent);
        lastFetchTime.current = Date.now();
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível carregar os quizzes.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [participationId, content.length]
  );

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = () => {
    loadData(true);
  };

  return {
    content,
    loading,
    refreshing,
    handleRefresh,
  };
};
