import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { useParticipation } from '../../../contexts/ParticipationContext';
import { FormRenderer } from '../../../components/FormRenderer';
import { FormBuilderDefinition } from '../../../types/form';
import { QuizRouteParams } from '../../../types/quiz';
import { useQuizSession } from '../../../hooks/useQuizSession';
import { styles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedbackBanner } from '../../../components/FeedbackBanner';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../utils/colors';
import { CustomHeader } from '../../../components/CustomHeader';
import { useAuth } from '../../../contexts/AuthContext';
import translate from '../../../locales/i18n';

export function QuizQuestionsScreen() {
  const route = useRoute();
  const { user } = useAuth();

  const insets = useSafeAreaInsets();
  const bottomBarHeight = 60 + insets.bottom;

  const { quizId, timeLimitMinutes, title, trackProgressId, sequenceId } =
    route.params as QuizRouteParams;
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
    handleAction,
  } = useQuizSession({
    quizId,
    timeLimitMinutes,
    participationId,
    title,
    trackProgressId,
    sequenceId,
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
        <Text style={{ marginTop: 10 }}>
          {translate('quizQuestions.loading')}
        </Text>
      </View>
    );
  }

  if (!currentQuestion) return null;

  const questionDefinition: FormBuilderDefinition = {
    fields: [{ ...currentQuestion, type: 'radio' as any }],
    title: undefined,
    description: undefined,
  };

  return (
    <View style={styles.container}>
      <CustomHeader userName={user?.name} showButton={false} />

      <View style={styles.header}>
        <Text style={styles.trailTitle}>{title}</Text>
        <Text style={styles.progressText}>
          {translate('quizQuestions.progress', {
            current: currentIndex + 1,
            total: fields.length,
          })}
        </Text>

        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentIndex + 1) / fields.length) * 100}%` },
            ]}
          />
        </View>

        {timeLeft !== null && (
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        )}
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

      {/* Botão com Gradiente */}
      <View style={[styles.footer, { paddingBottom: bottomBarHeight + 10 }]}>
        <TouchableOpacity
          style={[
            styles.actionButtonContainer,
            submitting && styles.disabledButton,
          ]}
          onPress={handleAction}
          disabled={submitting}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.azulClaro, colors.azulEscuro]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButtonGradient}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.actionButtonText}>
                {stepState === 'answering'
                  ? translate('quizQuestions.answer')
                  : isLastQuestion
                    ? translate('quizQuestions.finish')
                    : translate('quizQuestions.nextQuestion')}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
