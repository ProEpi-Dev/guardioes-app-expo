import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { useParticipation } from '../../../contexts/ParticipationContext';
import { FormRenderer } from '../../../components/FormRenderer';
import { FormBuilderDefinition } from '../../../types/form';
import { QuizRouteParams } from '../../../types/quiz';
import { useQuizSession } from '../../../hooks/useQuizSession';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedbackBanner } from '../../../components/FeedbackBanner';

export function QuizQuestionsScreen() {
  const route = useRoute();
  
  // 1. Pegamos os IDs da rota aqui. Eles já existem neste escopo.
  const { quizId, timeLimitMinutes, title, trackProgressId, sequenceId } = route.params as QuizRouteParams;
  const { participationId } = useParticipation();

  const {
    loading,
    submitting,
    fields,
    currentIndex,
    currentQuestion,
    isLastQuestion,
    stepState,
    timeLeft,
    currentResponse,
    handleAnswerChange,
    handleAction
    // REMOVIDO: trackProgressId e sequenceId não devem ser extraídos daqui
  } = useQuizSession({ 
      quizId, 
      timeLimitMinutes, 
      participationId, 
      title,
      // ADICIONADO: Passamos os IDs para o hook usar na lógica de envio
      trackProgressId, 
      sequenceId 
  });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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

  const questionDefinition: FormBuilderDefinition = {
    fields: [currentQuestion],
    title: undefined, description: undefined
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.progressText}>
            Questão {currentIndex + 1} de {fields.length}
          </Text>
          {timeLeft !== null && (
             <Text style={[styles.timerText, timeLeft < 60 && { color: '#F44336' }]}>
               {formatTime(timeLeft)}
             </Text>
          )}
        </View>
        <View style={{ width: 24 }} /> 
      </View>
      
      <View style={styles.progressBarBg}>
        <View 
          style={[styles.progressBarFill, { width: `${((currentIndex + 1) / fields.length) * 100}%` }]} 
        />
      </View>

      <View style={styles.contentContainer}>
        {stepState === 'feedback' && (
          <FeedbackBanner 
            question={currentQuestion} 
            userAnswer={currentResponse[currentQuestion.name]} 
          />
        )}
        
        <FormRenderer 
          key={currentIndex} 
          definition={questionDefinition}
          initialValues={currentResponse}
          onChange={handleAnswerChange}
          readOnly={stepState === 'feedback'} 
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.actionButton, submitting && styles.disabledButton]}
          onPress={handleAction}
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