import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';

export function PrivacyModal({ visible, onClose, title, children }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.modalCloseButton} 
            onPress={onClose} 
          >
            <Feather name="x" size={28} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{title}</Text>

          <ScrollView style={styles.modalScrollView}>
            {children}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}