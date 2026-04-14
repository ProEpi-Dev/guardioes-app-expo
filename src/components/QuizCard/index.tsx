import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { QuizCardProps } from '../../types/quiz';
import { styles } from './styles';

export default function QuizCard({
  title,
  active,
  score,
  attemptNumber,
  isPassed,
  passingScore,
  maxAttempts,
  onPress,
}: QuizCardProps) {
  const isCompleted = score !== null && score !== undefined;
  const statusColor = isCompleted
    ? isPassed
      ? '#4CAF50'
      : '#F44336'
    : 'black';

  const getIconName = () => {
    if (!active) return 'lock';
    if (isCompleted) {
      return isPassed ? 'check-circle' : 'x-circle';
    }
    return 'unlock';
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        !active && { opacity: 0.5, backgroundColor: '#e0e0e0' },
        isCompleted && { borderColor: statusColor, borderWidth: 1 },
      ]}
      onPress={onPress}
      disabled={!active}
    >
      <Feather
        name={getIconName()}
        size={24}
        color={isCompleted ? statusColor : 'black'}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text
          style={{
            fontWeight: isCompleted ? 'bold' : 'normal',
            color: statusColor,
          }}
        >
          {isCompleted ? `${score}/100` : ' - /100'}
        </Text>
        {passingScore !== null && passingScore !== undefined && (
          <Text style={styles.passingScoreText}>Mín: {passingScore}</Text>
        )}
        {isCompleted && attemptNumber !== undefined && (
          <Text style={styles.attemptText}>
            Tentativa: {attemptNumber} {maxAttempts ? `/ ${maxAttempts}` : ''}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
