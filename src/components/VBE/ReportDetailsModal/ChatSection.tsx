import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '../../../services/reports';
import { Messages } from '../../../types/report';

interface ChatSectionProps {
  reportMessages?: Messages;
  formatDate: (isoString?: string) => string;
}

export function ChatSection({ reportMessages, formatDate }: ChatSectionProps) {
  const [mensagemDigitada, setMensagemDigitada] = useState('');
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  const handleEnviarMensagem = async () => {
    if (mensagemDigitada.trim() === '' || !reportMessages?.id) return;

    setIsSending(true);
    try {
      await sendMessage({ message: mensagemDigitada }, reportMessages.id);
      setMensagemDigitada('');
      queryClient.invalidateQueries({ queryKey: ['report-messages'] });
    } catch (e) {
      console.log('Erro ao enviar mensagem:', e);
    } finally {
      setIsSending(false);
    }
  };

  if (!reportMessages?.messages) return null;

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.title}>Mensagens</Text>

      {reportMessages.messages.map((mensagem) => {
        const isRecebido = mensagem.direction === 'inbound';
        return (
          <View
            key={mensagem.id}
            style={isRecebido ? styles.balaoRecebido : styles.balaoEnviado}
          >
            <Text
              style={isRecebido ? styles.textoRecebido : styles.textoEnviado}
            >
              {mensagem.body}
            </Text>
            <Text style={isRecebido ? styles.dataRecebida : styles.dataEnviada}>
              {formatDate(mensagem.createdAt)}
            </Text>
          </View>
        );
      })}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escreva uma mensagem..."
          placeholderTextColor="#9CA3AF"
          value={mensagemDigitada}
          onChangeText={setMensagemDigitada}
          multiline={true}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!mensagemDigitada.trim() || isSending) &&
              styles.sendButtonDisabled,
          ]}
          onPress={handleEnviarMensagem}
          disabled={!mensagemDigitada.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.sendButtonText}>Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  balaoRecebido: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: '85%',
    marginBottom: 12,
  },
  balaoEnviado: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '85%',
    marginBottom: 12,
  },
  textoRecebido: { color: '#111827', fontSize: 15 },
  textoEnviado: { color: '#FFFFFF', fontSize: 15 },
  dataRecebida: {
    color: '#6B7280',
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  dataEnviada: {
    color: '#E5E7EB',
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#111827',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#93C5FD' },
  sendButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});
