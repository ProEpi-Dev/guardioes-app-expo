import React from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { FormRenderer } from '../FormRenderer';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SentimentModalProps {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  sending: boolean;
  formDefinition: any;
  onFormChange: (val: any) => void;
  onSubmit: () => void;
}

export function SentimentModal({ visible, onClose, loading, sending, formDefinition, onFormChange, onSubmit }: SentimentModalProps) {
  const azul = '#2E97BE';

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={azul} barStyle="light-content" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.center}><ActivityIndicator size="large" color={azul} /></View>
          ) : (
            <>
              <View style={styles.content}>
                 {formDefinition && <FormRenderer definition={formDefinition} onChange={onFormChange} />}
              </View>
              <View style={styles.footer}>
                <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose} disabled={sending}>
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnSubmit]} onPress={onSubmit} disabled={sending}>
                  {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Enviar</Text>}
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'flex-end', padding: 16, backgroundColor: '#2E97BE' },
  closeBtn: { padding: 5, backgroundColor: '#fff', borderRadius: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 16 },
  footer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderColor: '#eee' },
  btn: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 6 },
  btnCancel: { backgroundColor: '#ccc' },
  btnSubmit: { backgroundColor: '#2E97BE' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});