import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { normalizeAnswer } from '../../utils/quizHelpers';
import { styles } from './styles';
import { FormField } from '../../types/form';

interface QuestionReviewCardProps {
  question: FormField;
  userAnswer: any;
  index: number;
}

export const QuestionReviewCard: React.FC<QuestionReviewCardProps> = ({ question, userAnswer, index }) => {
  const qAny = question as any;
  const correctAnswer = qAny.correctAnswer;
  const hasCorrectAnswer = correctAnswer !== undefined && correctAnswer !== null;

  const isCorrect = hasCorrectAnswer
    ? normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer)
    : true; 

  const selectedOption = qAny.options?.find((opt: any) => 
    normalizeAnswer(opt.value) === normalizeAnswer(userAnswer)
  );

  let feedbackText = selectedOption?.feedback;
  if (!feedbackText && qAny.feedback?.incorrect) {
    feedbackText = qAny.feedback.incorrect;
  }

  const answerLabel = selectedOption ? selectedOption.label : String(userAnswer || 'Sem resposta');

  const correctAnswerLabel = !isCorrect && hasCorrectAnswer
    ? qAny.options?.find((o: any) => normalizeAnswer(o.value) === normalizeAnswer(correctAnswer))?.label || correctAnswer
    : '';

  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionIndex}>Questão {index + 1}</Text>
        <Feather 
          name={isCorrect ? "check-circle" : "x-circle"} 
          size={20} 
          color={isCorrect ? "#4CAF50" : "#F44336"} 
        />
      </View>
      
      <Text style={styles.questionTitle}>{question.label}</Text>

      <View style={styles.answerContainer}>
        <Text style={styles.label}>Sua resposta:</Text>
        <Text style={[styles.answerText, { color: isCorrect ? "#4CAF50" : "#F44336" }]}>
          {answerLabel}
        </Text>
      </View>

      {!isCorrect && hasCorrectAnswer && (
        <View style={styles.answerContainer}>
          <Text style={styles.label}>Resposta correta:</Text>
          <Text style={[styles.answerText, { color: "#4CAF50" }]}>
            {correctAnswerLabel}
          </Text>
        </View>
      )}

      {feedbackText && (
        <View style={[styles.feedbackBox, { backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE' }]}>
          <Text style={[styles.feedbackText, { color: isCorrect ? "#2E7D32" : "#C62828" }]}>
            {feedbackText}
          </Text>
        </View>
      )}
    </View>
  );
};