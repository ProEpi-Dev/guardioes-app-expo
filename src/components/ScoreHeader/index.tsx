import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

interface ScoreHeaderProps {
  title: string;
  score: number;
  isPassed: boolean;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({ title, score, isPassed }) => {
  const color = isPassed ? '#4CAF50' : '#D32F2F';

  return (
    <View style={styles.headerResult}>
      <Text style={styles.quizTitle}>{title}</Text>
      
      <View style={[styles.scoreCircle, { borderColor: color }]}>
        <Text style={[styles.scoreValue, { color }]}>
          {score}%
        </Text>
        <Text style={styles.scoreLabel}>Nota final</Text>
      </View>

      {/* Container com sombra na cor do status para dar o efeito de "Glow" */}
      <View style={[styles.statusButtonContainer, { backgroundColor: color, shadowColor: color }]}>
        <Text style={styles.statusText}>
          {isPassed ? "Aprovado" : "Reprovado"}
        </Text>
      </View>
    </View>
  );
};