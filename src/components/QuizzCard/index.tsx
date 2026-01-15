import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { scale } from '../../utils/scalling';

interface Props {
  title: string;
  active: boolean;
  score?: number | null;
  onPress: () => void;
  isPassed?: boolean;
  attemptNumber?: number;
}

export default function QuizzCard({ title, active, score, attemptNumber, isPassed, onPress }: Props) {
  const isCompleted = score !== null && score !== undefined;
  const statusColor = isCompleted 
    ? (isPassed ? '#4CAF50' : '#F44336') 
    : 'black';

  const getIconName = () => {
    if (!active) return "lock";
    if (isCompleted) {
      return isPassed ? "check-circle" : "x-circle"; 
    }
    return "unlock";
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        !active && { opacity: 0.5, backgroundColor: '#e0e0e0' },
        isCompleted && { borderColor: statusColor, borderWidth: 1 }
      ]}
      onPress={onPress}
      disabled={!active}
    >
      <Feather 
        name={getIconName()} 
        size={24} 
        color={isCompleted ? statusColor : "black"} 
      />
      
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontWeight: isCompleted ? 'bold' : 'normal', color: statusColor }}>
          {isCompleted ? `${score}/100` : ' - /100'}
        </Text>
        {isCompleted && attemptNumber !== undefined && (
          <Text style={styles.attemptText}>
            Tentativa: {attemptNumber}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3
  },
  title: {
    fontSize: scale(16),
    fontWeight: 'bold',
    marginLeft: 12,
    marginRight: 12,
    textAlign: 'justify'
  },
  attemptText: {
    fontSize: scale(10),
    color: '#666',
    marginTop: 2
  }
});