import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import {scale} from '../../utils/scalling';

interface Props {
  title: string;
  active: boolean;
  score?: number | null;
  onPress: () => void;
}

export default function QuizzCard({ title, active, score, onPress }: Props) {
    const isCompleted = score !== null && score !== undefined;
    const getIconName = () => {
        if (!active) return "lock";
        if (isCompleted) return "check-circle";
        return "unlock";
    }
  return (
    <TouchableOpacity 
        style={[styles.card, !active && {opacity: 0.5, backgroundColor: '#e0e0e0'}, isCompleted && { borderColor: '#4CAF50', borderWidth: 1 }]} 
        onPress={onPress}
        disabled={!active}>
            <Feather name={getIconName()} size={24} color={isCompleted ? "green" : "black"} />
            <View style={{flex:1}}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={{ fontWeight: isCompleted ? 'bold' : 'normal', color: isCompleted ? 'green' : 'black' }}>
                {isCompleted ? `${score}/100` : ' - /100'}
            </Text>
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
})