import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';

// Helper to normalize strings for comparison
const normalize = (val: any) => String(val || '').trim().toLowerCase();

interface FeedbackBannerProps {
  question: any;
  userAnswer: any;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ question, userAnswer }) => {
  const correctAnswer = question.correctAnswer;
  const hasCorrectAnswer = correctAnswer !== undefined && correctAnswer !== null;

  // Logic to find specific option feedback
  const selectedOption = question.options?.find((opt: any) => 
    normalize(opt.value) === normalize(userAnswer)
  );

  let feedbackText = selectedOption?.feedback;
  if (!feedbackText && question.feedback?.incorrect) {
    feedbackText = question.feedback.incorrect;
  }

  // If no "correct answer" is defined in backend, treat as generic submission
  if (!hasCorrectAnswer) {
    return (
      <View style={[styles.banner, { backgroundColor: '#E3F2FD' }]}>
        <View style={styles.header}>
          <Feather name="check" size={24} color="#1565C0" />
          <Text style={[styles.title, { color: "#1565C0" }]}>Resposta Registrada</Text>
        </View>
        {feedbackText && <Text style={[styles.text, { color: "#1565C0" }]}>{feedbackText}</Text>}
      </View>
    );
  }

  const isCorrect = normalize(userAnswer) === normalize(correctAnswer);
  const color = isCorrect ? "#2E7D32" : "#C62828";
  const bg = isCorrect ? '#E8F5E9' : '#FFEBEE';

  return (
    <View style={[styles.banner, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Feather name={isCorrect ? "check-circle" : "x-circle"} size={24} color={color} />
        <Text style={[styles.title, { color }]}>
          {isCorrect ? "Resposta Correta!" : "Resposta Incorreta"}
        </Text>
      </View>
      {feedbackText && <Text style={styles.text}>{feedbackText}</Text>}
      {!isCorrect && (
        <Text style={styles.correctText}>Resposta esperada: {String(correctAnswer)}</Text>
      )}
    </View>
  );
};
