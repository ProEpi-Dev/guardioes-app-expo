import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

interface ScoreHeaderProps {
  title: string;
  score: number;
  isPassed: boolean;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({ title, score, isPassed }) => {
  const color = isPassed ? '#4CAF50' : '#F44336';

  return (
    <View style={styles.headerResult}>
      <Text style={styles.quizTitle}>{title}</Text>
      
      <View style={[styles.scoreCircle, { borderColor: color }]}>
        <Text style={[styles.scoreValue, { color }]}>
          {score}%
        </Text>
        <Text style={styles.scoreLabel}>Nota Final</Text>
      </View>

      <Text style={[styles.statusText, { backgroundColor: color }]}>
        {isPassed ? "APROVADO" : "REPROVADO"}
      </Text>
    </View>
  );
};