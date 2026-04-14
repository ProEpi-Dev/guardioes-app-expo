import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { completeContentSequence } from '../services/trail';
import { getUserSubmissions, getQuizDetails } from '../services/quiz';
import { useParticipation } from '../contexts/ParticipationContext';

export const useTrailNavigation = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const { participationId } = useParticipation();

  const handleQuizPress = async (
    seqItem: any,
    trackProgressId: number | null,
    isCycleExpired: boolean = false
  ) => {
    if (!seqItem.active) return;

    if (!participationId) {
      Alert.alert('Erro', 'Participação não identificada.');
      return;
    }

    setLoading(true);

    try {
      let mySubmissions: any[] = [];
      try {
        const submissions = await getUserSubmissions(participationId);
        mySubmissions = submissions.filter(
          (s: any) => s.formVersion?.form?.id === seqItem.form.id
        );
      } catch (err) {
        console.warn('Falha ao buscar submissões:', err);
      }

      let quizDetails: any = {};
      try {
        quizDetails = await getQuizDetails(seqItem.form.id);
      } catch (err) {
        console.warn('Falha ao buscar detalhes:', err);
      }

      const attemptsCount = mySubmissions.length;
      const passedSubmission = mySubmissions.find((s: any) => s.isPassed);
      const lastSubmission = mySubmissions.length > 0 ? mySubmissions[0] : null;

      const qVersion = quizDetails?.latestVersion || {};
      const qDef = quizDetails?.definition || {};

      const maxAttempts =
        qVersion.maxAttempts ??
        quizDetails?.maxAttempts ??
        qDef.maxAttempts ??
        seqItem.maxAttempts;
      const passingScore =
        qVersion.passingScore ??
        quizDetails?.passingScore ??
        qDef.passingScore ??
        seqItem.passingScore;
      const timeLimitMinutes =
        qVersion.timeLimitMinutes ??
        quizDetails?.timeLimitMinutes ??
        qDef.timeLimitMinutes ??
        seqItem.timeLimitMinutes;

      const isCompleted = !!passedSubmission;
      const isExhausted = maxAttempts && attemptsCount >= maxAttempts;

      if (isCompleted || isExhausted) {
        const targetSubmission = passedSubmission || lastSubmission;

        navigation.navigate('QuizResultScreen', {
          resultData: {
            score: targetSubmission?.score || 0,
            isPassed: !!targetSubmission?.isPassed,
          },
          userAnswers: targetSubmission?.quizResponse || {},
          questions: qDef.fields || [],
          title: seqItem.form.title,
        });
        return;
      }

      if (isCycleExpired) {
        Alert.alert(
          'Prazo Encerrado',
          'Você não pode realizar este quiz pois o prazo do ciclo já encerrou.'
        );
        return;
      }

      navigation.navigate('QuizzInfoScreen', {
        quizId: seqItem.form.id,
        title: seqItem.form.title,
        currentAttempt: attemptsCount + 1,
        linkedArticle: null,
        maxAttempts: maxAttempts,
        timeLimitMinutes: timeLimitMinutes,
        passingScore: passingScore,
        trackProgressId: trackProgressId,
        sequenceId: seqItem.id,
        isCycleExpired: isCycleExpired,
      });
    } catch (error) {
      console.error('Erro na navegação do quiz:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao acessar o quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleArticlePress = async (
    content: any,
    trackProgressId: number | null,
    sequenceId: number,
    isCycleExpired: boolean = false
  ) => {
    if (isCycleExpired) {
      Alert.alert(
        'Ciclo Encerrado',
        'Você pode acessar este conteúdo para leitura, mas ele não será contabilizado no seu progresso pois o prazo encerrou.',
        [
          {
            text: 'Ler conteúdo',
            onPress: () => navigation.navigate('Article', { article: content }),
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }

    if (trackProgressId && sequenceId) {
      completeContentSequence(trackProgressId, sequenceId).catch((err) =>
        console.error('Erro ao marcar conteúdo:', err)
      );
    }
    navigation.navigate('Article', { article: content });
  };

  return { handleQuizPress, handleArticlePress, loading };
};
