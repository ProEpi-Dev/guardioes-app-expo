import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { FormRenderer } from '../FormRenderer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SentimentModalProps } from '../../types/sentimentModal';
import { styles } from './styles';

export function SentimentModal({
  visible,
  onClose,
  loading,
  sending,
  formDefinition,
  onFormChange,
  onSubmit,
  title,
}: SentimentModalProps) {
  const azul = '#2E97BE';

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={azul} barStyle="light-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={azul} />
            </View>
          ) : (
            <>
              <View style={styles.content}>
                {formDefinition && (
                  <FormRenderer
                    definition={formDefinition}
                    onChange={onFormChange}
                  />
                )}
              </View>
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnCancel]}
                  onPress={onClose}
                  disabled={sending}
                >
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnSubmit]}
                  onPress={onSubmit}
                  disabled={sending}
                >
                  {sending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Enviar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
