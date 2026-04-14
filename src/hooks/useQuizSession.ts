import { useState, useEffect, useRef } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormField } from '../types/form';
import { QuizStepState } from '../types/quiz';
import { getQuizDetails, submitQuizAttempt } from '../services/quiz';
import { completeQuizSequence } from '../services/trail';

interface UseQuizSessionProps {
  quizId: number;
  timeLimitMinutes?: number | null;
  participationId: number | null;
  title: string;
  trackProgressId?: number;
  sequenceId?: number;
  isCycleExpired?: boolean;
}

export const useQuizSession = ({
  quizId,
  timeLimitMinutes,
  participationId,
  title,
  trackProgressId,
  sequenceId,
  isCycleExpired,
}: UseQuizSessionProps) => {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fields, setFields] = useState<FormField[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepState, setStepState] = useState<QuizStepState>('answering');
  const [currentResponse, setCurrentResponse] = useState<Record<string, any>>(
    {}
  );
  const [timeLeft, setTimeLeft] = useState<number | null>(
    timeLimitMinutes ? Number(timeLimitMinutes) * 60 : null
  );

  const allAnswersRef = useRef<Record<string, any>>({});
  const versionIdRef = useRef<number | null>(null);
  const startedAtRef = useRef<string>(new Date().toISOString());

  // Bloqueio de botão voltar
  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        'Atenção',
        'Você deve concluir o quiz para sair. Responda todas as questões ou aguarde o tempo acabar.',
        [{ text: 'Continuar Quiz', onPress: () => {} }],
        { cancelable: false }
      );
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, []);

  // Timer
  useEffect(() => {
    if (loading || !timeLimitMinutes) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          clearInterval(interval);
          handleTimeExpired();
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, timeLimitMinutes]);

  const handleTimeExpired = () => {
    Alert.alert(
      'Tempo Esgotado!',
      'O tempo acabou. Vamos calcular sua pontuação.',
      [{ text: 'Ver Resultado', onPress: () => submitQuiz() }],
      { cancelable: false }
    );
  };

  // Carregamento inicial
  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      startedAtRef.current = new Date().toISOString();
      const version = await getQuizDetails(quizId);
      setFields(version.definition.fields || []);
      versionIdRef.current = version.id;
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar o quiz.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (values: Record<string, any>) => {
    if (stepState === 'answering') setCurrentResponse(values);
  };

  const confirmAnswer = () => {
    const currentField = fields[currentIndex];
    const answer = currentResponse[currentField.name];

    if (answer === undefined || answer === null || answer === '') {
      return Alert.alert(
        'Atenção',
        'Por favor, responda a pergunta para continuar.'
      );
    }

    allAnswersRef.current = { ...allAnswersRef.current, ...currentResponse };
    setStepState('feedback');
  };

  const nextQuestion = () => {
    setStepState('answering');
    setCurrentResponse({});
    setCurrentIndex((prev) => prev + 1);
  };

  // Função auxiliar para processar o envio após as validações
  const processSubmission = async (payload: any, finalAnswers: any) => {
    try {
      const result = await submitQuizAttempt(payload);

      // Lógica de Trilha:
      // Só marca como completo na trilha se:
      // 1. Passou no quiz
      // 2. Tem os IDs de contexto da trilha
      // 3. O ciclo NÃO está expirado (!isCycleExpired)
      if (result.isPassed && trackProgressId && sequenceId && !isCycleExpired) {
        try {
          await completeQuizSequence(trackProgressId, sequenceId, result.id);
        } catch (seqError) {
          console.error('Erro ao vincular progresso na trilha', seqError);
        }
      }

      navigation.replace('QuizResultScreen', {
        resultData: { score: result.score, isPassed: result.isPassed },
        userAnswers: finalAnswers,
        questions: fields,
        title,
      });
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Erro no Envio',
        'Não foi possível enviar o quiz. Tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const submitQuiz = async () => {
    if (!versionIdRef.current) return;
    setSubmitting(true);

    const finalAnswers = { ...allAnswersRef.current, ...currentResponse };

    const payload = {
      formVersionId: versionIdRef.current,
      participationId,
      startedAt: startedAtRef.current,
      completedAt: new Date().toISOString(),
      quizResponse: { ...finalAnswers, _isValid: true },
    };

    // VERIFICAÇÃO DE PRAZO
    if (isCycleExpired) {
      Alert.alert(
        'Prazo Encerrado',
        'O prazo para este ciclo já encerrou. Você pode enviar suas respostas, mas este quiz não contará para o progresso da trilha.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => setSubmitting(false),
          },
          {
            text: 'Enviar mesmo assim',
            onPress: () => processSubmission(payload, finalAnswers),
          },
        ]
      );
      return;
    }

    // Se estiver dentro do prazo, envia direto
    await processSubmission(payload, finalAnswers);
  };

  const handleAction = () => {
    const isLast = currentIndex === fields.length - 1;
    if (stepState === 'answering') confirmAnswer();
    else if (!isLast) nextQuestion();
    else submitQuiz();
  };

  return {
    loading,
    submitting,
    fields,
    currentIndex,
    currentQuestion: fields[currentIndex],
    isLastQuestion: currentIndex === fields.length - 1,
    stepState,
    timeLeft,
    currentResponse,
    handleAnswerChange,
    handleAction,
  };
};
