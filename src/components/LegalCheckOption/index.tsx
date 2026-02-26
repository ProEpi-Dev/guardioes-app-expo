import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { scale } from '../../utils/scalling';

interface Props {
  title: string;
  isChecked: boolean;
  onToggle: () => void;
  onRead: () => void;
}

export const LegalCheckOption: React.FC<Props> = ({ title, isChecked, onToggle, onRead }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onToggle} style={styles.checkbox} activeOpacity={0.8}>
      {isChecked && <Feather name="check" size={16} color="#ffffff" />}
    </TouchableOpacity>
    <View style={styles.textContainer}>
      <Text style={styles.baseText}>Li e aceito: </Text>
      <TouchableOpacity onPress={onRead} activeOpacity={0.7}>
        <Text style={styles.linkText}>{title}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
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
  textContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  baseText: {
    color: '#ffffff',
    fontSize: scale(14),
    lineHeight: scale(20),
  },
  linkText: {
    color: '#ffffff',
    fontSize: scale(14),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    lineHeight: scale(20),
  }
});