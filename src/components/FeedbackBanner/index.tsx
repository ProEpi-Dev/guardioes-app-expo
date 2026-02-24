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

  const isCorrect = hasCorrectAnswer ? normalize(userAnswer) === normalize(correctAnswer) : false;

  let feedbackText = selectedOption?.feedback;
  if (!feedbackText) {
    feedbackText = isCorrect ? question.feedback?.correct : question.feedback?.incorrect;
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
  const color = isCorrect ? "#2E7D32" : "#C62828";
  const bg = isCorrect ? '#D1F4E0' : '#FDECEA';

  return (
    <View style={[styles.banner, { backgroundColor: bg, borderColor: color }]}>
      <View style={styles.header}>
        <Feather name={isCorrect ? "check-circle" : "x-circle"} size={28} color={color} />
        <Text style={[styles.title, { color }]}>
          {isCorrect ? "Resposta correta" : "Resposta Incorreta"}
        </Text>
      </View>
      {feedbackText && <Text style={[styles.text, { color }]}>{feedbackText}</Text>}
      {hasCorrectAnswer && (
        <Text style={[styles.correctText, { color }]}>
          Resposta certa: {String(correctAnswer)}
        </Text>
      )}
    </View>
  );
};
