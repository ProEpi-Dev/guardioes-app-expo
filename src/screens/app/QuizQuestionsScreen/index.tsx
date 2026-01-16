import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../../utils/api';
import { scale } from '../../../utils/scalling';
import { useParticipation } from '../../../contexts/ParticipationContext';
import { FormRenderer } from '../../../components/FormRenderer';
import { FormBuilderDefinition, FormField } from '../../../types/form';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RouteParams {
  quizId: number;
  title: string;
  timeLimitMinutes?: number | null;
}

const normalizeAnswer = (val: any): string => {
  if (val === null || val === undefined) return '';
  return String(val).trim().toLowerCase();
};

export function QuizzQuestionsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { quizId, timeLimitMinutes } = route.params as RouteParams;
  const { participationId } = useParticipation();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [allFields, setAllFields] = useState<FormField[]>([]);
  const [formVersionId, setFormVersionId] = useState<number | null>(null);
  const formVersionIdRef = useRef<number | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState<Record<string, any>>({});
  
  const allAnswersRef = useRef<Record<string, any>>({});
  const currentResponseRef = useRef<Record<string, any>>({}); 
  const startedAtRef = useRef<string>(new Date().toISOString());

  const [timeLeft, setTimeLeft] = useState<number | null>(
    timeLimitMinutes ? Number(timeLimitMinutes) * 60 : null
  );

  const [stepState, setStepState] = useState<'answering' | 'feedback'>('answering');

  useEffect(() => {
    currentResponseRef.current = currentResponse;
  }, [currentResponse]);

  const fetchQuizDefinition = useCallback(async () => {
    try {
      setLoading(true);
      startedAtRef.current = new Date().toISOString();

      const response: any = await apiClient(`/v1/forms/${quizId}`, { method: 'GET' });
      const formData = response.data || response;

      if (formData && formData.latestVersion) {
        setAllFields(formData.latestVersion.definition.fields || []);
        
        setFormVersionId(formData.latestVersion.id);
        formVersionIdRef.current = formData.latestVersion.id; 
        
      } else {
        throw new Error("Definição do quiz não encontrada.");
      }
    } catch (error) {
      console.error("Erro ao carregar quiz:", error);
      Alert.alert("Erro", "Não foi possível carregar as perguntas.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuizDefinition();
  }, []);

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);

      const finalVersionId = formVersionIdRef.current;

      if (!finalVersionId) {
        throw new Error("O Quiz ainda não foi carregado corretamente.");
      }

      const finalAnswers = {
        ...allAnswersRef.current,
        ...currentResponseRef.current 
      };

      const now = new Date();
      let finalStartedAt = startedAtRef.current;
      
      if (timeLimitMinutes) {
        const start = new Date(finalStartedAt);
        const diffInMillis = now.getTime() - start.getTime();
        const limitInMillis = timeLimitMinutes * 60 * 1000;

        if (diffInMillis > limitInMillis) {
           const adjustedStart = new Date(now.getTime() - limitInMillis);
           finalStartedAt = adjustedStart.toISOString();
        }
      }

      const payload = {
        formVersionId: finalVersionId,
        participationId: participationId,
        startedAt: finalStartedAt,
        completedAt: now.toISOString(), 
        quizResponse: {
          ...finalAnswers,
          _isValid: true
        }
      };

      console.log("Enviando Payload:", JSON.stringify(payload, null, 2));

      await apiClient('/v1/quiz-submissions', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      Alert.alert("Sucesso!", "Quiz concluído com sucesso!", [
        { text: "OK", onPress: () => navigation.popToTop() }
      ]);

    } catch (error: any) {
      console.error("Erro Raw:", error);

      let msg = "Não foi possível enviar o quiz.";
      const errorCode = error?.data?.error?.code;

      if (errorCode === 'BadRequestException') {
         const details = error?.data?.message;
         if (String(details).includes("Tempo limite")) {
            msg = "O tempo limite foi excedido, mas tentamos ajustar. Tente novamente.";
         } else {
            msg = Array.isArray(details) ? details[0] : "Verifique os dados enviados.";
         }
      } else if (error?.message) {
         msg = error.message;
      }

      Alert.alert("Erro no Envio", msg);
      
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (loading || !timeLimitMinutes || Number(timeLimitMinutes) <= 0) return; 

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
  }, [timeLimitMinutes, loading]);

  const handleTimeExpired = () => {
    Alert.alert(
      "Tempo Esgotado!",
      "O tempo acabou. Enviaremos suas respostas até aqui.",
      [{ text: "OK", onPress: () => handleSubmitQuiz() }],
      { cancelable: false }
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = allFields[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === allFields.length - 1;

  const singleQuestionDefinition: FormBuilderDefinition = {
    fields: currentQuestion ? [currentQuestion] : [],
    title: undefined,
    description: undefined
  };

  const handleFormChange = (values: Record<string, any>) => {
    if (stepState === 'answering') {
      setCurrentResponse(values);
    }
  };

  const handleMainButtonPress = async () => {
    const fieldName = currentQuestion.name;
    const answerValue = currentResponse[fieldName];

    if (stepState === 'answering') {
      if (answerValue === undefined || answerValue === null || answerValue === '') {
        Alert.alert("Atenção", "Por favor, responda a pergunta para continuar.");
        return;
      }
      allAnswersRef.current = { ...allAnswersRef.current, ...currentResponse };
      setStepState('feedback');
    } 
    else if (stepState === 'feedback' && !isLastQuestion) {
      setStepState('answering');
      setCurrentResponse({});
      setCurrentQuestionIndex((prev) => prev + 1);
    } 
    else if (stepState === 'feedback' && isLastQuestion) {
      await handleSubmitQuiz();
    }
  };

  const renderResultIndicator = () => {
    if (stepState !== 'feedback') return null;
    
    const qAny = currentQuestion as any;
    const userAnswer = currentResponse[currentQuestion.name];
    const correctAnswer = qAny.correctAnswer;

    if (correctAnswer !== undefined && correctAnswer !== null) {
      const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
      
      return (
        <View style={[styles.resultBanner, { backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE' }]}>
          <Feather 
            name={isCorrect ? "check-circle" : "x-circle"} 
            size={24} 
            color={isCorrect ? "#2E7D32" : "#C62828"} 
          />
          <View style={{flex: 1, marginLeft: 8}}>
            <Text style={[styles.resultText, { color: isCorrect ? "#2E7D32" : "#C62828" }]}>
              {isCorrect ? "Resposta Correta!" : "Resposta Incorreta"}
            </Text>
            {!isCorrect && (
              <Text style={{ fontSize: scale(12), color: '#666', marginTop: 4 }}>
                Resposta esperada: {String(correctAnswer)}
              </Text>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.resultBanner, { backgroundColor: '#E3F2FD' }]}>
        <Feather name="check" size={24} color="#1565C0" />
        <View style={{flex: 1, marginLeft: 8}}>
            <Text style={[styles.resultText, { color: "#1565C0" }]}>
            Resposta Registrada
            </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Carregando...</Text>
      </View>
    );
  }

  if (!currentQuestion) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.progressText}>
            Questão {currentQuestionIndex + 1} de {allFields.length}
          </Text>
          
          {timeLeft !== null && (
             <Text style={[
               styles.timerText, 
               timeLeft < 60 && { color: '#F44336' } 
             ]}>
               {formatTime(timeLeft)}
             </Text>
          )}
        </View>

        <View style={{ width: 24 }} /> 
      </View>
      
      <View style={styles.progressBarBg}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${((currentQuestionIndex + 1) / allFields.length) * 100}%` }
          ]} 
        />
      </View>

      <View style={styles.contentContainer}>
        {renderResultIndicator()}
        
        <FormRenderer 
          key={currentQuestionIndex} 
          definition={singleQuestionDefinition}
          initialValues={currentResponse}
          onChange={handleFormChange}
          readOnly={stepState === 'feedback'} 
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.actionButton, submitting && styles.disabledButton]}
          onPress={handleMainButtonPress}
          disabled={submitting}
        >
          {submitting ? (
             <ActivityIndicator color="#FFF" />
          ) : (
             <Text style={styles.actionButtonText}>
               {stepState === 'answering' ? 'Responder' : (isLastQuestion ? 'Concluir' : 'Próxima Pergunta')}
             </Text>
          )}
          {!submitting && <Feather name="arrow-right" size={20} color="#FFF" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  progressText: { fontSize: scale(14), fontWeight: '600', color: '#666' },
  timerText: { fontSize: scale(14), fontWeight: 'bold', color: '#0000ff', marginTop: 2 },
  progressBarBg: { height: 4, backgroundColor: '#E0E0E0', width: '100%' },
  progressBarFill: { height: '100%', backgroundColor: '#0000ff' },
  contentContainer: { flex: 1, padding: 20 },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultText: { fontWeight: 'bold', fontSize: scale(16) },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  actionButton: {
    backgroundColor: '#0000ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
  },
  disabledButton: { backgroundColor: '#CCC' },
  actionButtonText: { color: '#FFF', fontSize: scale(16), fontWeight: 'bold' }
});