import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { scale } from '../../utils/scalling';

interface Props {
  label: string;
  isChecked: boolean;
  onPress: () => void;
}

export const LegalCheckOption: React.FC<Props> = ({ label, isChecked, onPress }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onPress} style={styles.checkbox}>
      {isChecked && <Feather name="check" size={16} color="#ffffff" />}
    </TouchableOpacity>
    
    <TouchableOpacity onPress={onPress} style={styles.textContainer}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginTop: 15,
    marginBottom: 5
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  textContainer: { flex: 1 },
  label: {
    color: '#ffffff',
    fontFamily: 'System',
    fontSize: scale(14),
    textDecorationLine: 'underline'
  }
});