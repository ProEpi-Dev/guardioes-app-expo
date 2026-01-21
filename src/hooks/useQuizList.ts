import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Quizes } from '../types/quiz';
import { getActiveQuizzes, getContentQuizMapping, getUserSubmissions } from '../services/quiz';

export const useQuizList = (participationId: number | null) => {
  const [content, setContent] = useState<Quizes[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (!participationId) return;
    
    try {
      if (!isRefresh) setLoading(true);
      else setRefreshing(true);

      const [quizzesData, submissionsData, contentMappingData] = await Promise.all([
        getActiveQuizzes(),
        getUserSubmissions(participationId),
        getContentQuizMapping()
      ]);

      const mergedContent = quizzesData.map((quiz: any) => {
        const versionId = quiz.latestVersion?.id;
        const userResult = submissionsData.find((res: any) => res.formVersionId === versionId);
        
        const linkedContentRelation = contentMappingData.find(
            (relation: any) => String(relation.formId) === String(quiz.id)
        );

        const baseQuiz = {
            ...quiz,
            passingScore: quiz.latestVersion?.passingScore,
            maxAttempts: quiz.latestVersion?.maxAttempts,
            timeLimitMinutes: quiz.latestVersion?.timeLimitMinutes,
            linkedArticle: linkedContentRelation ? linkedContentRelation.content : null
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

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os quizzes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [participationId]);

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
    handleRefresh
  };
};