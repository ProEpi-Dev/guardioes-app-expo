import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReportDetailsResponse, ReportTypee } from '../../../types/report';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessage, sendMessage } from '../../../services/reports';

interface Props {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  data?: ReportDetailsResponse;
  integrationData?: ReportTypee;
}

// Dicionário para deixar as chaves da API com os mesmos textos da sua imagem
const LABEL_MAP: Record<string, string> = {
  localizacao: 'Localização Administrativa',
  evento_afetados: 'Quem são os afetados?',
  evento_descricao: 'Marque a opção que melhor descreve o que ocorreu',
  evento_data_ocorrencia: 'Quando ocorreu?',
  evento_qtde_envolvidos: 'Quantos envolvidos?',
  evento_grupo_vulneravel: 'Quais grupos vulneráveis?',
  evento_local_ocorrencia: 'Local',
  evento_sabe_quando_ocorreu: 'Sabe quando ocorreu?',
  evento_existem_grupos_vulneraveis: 'Existem grupos vulneráveis?',
};

export function ReportDetailsModal({
  visible,
  onClose,
  loading,
  data,
  integrationData,
}: Props) {
  const [mensagemDigitada, setMensagemDigitada] = useState('');
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  const { data: reportMessages } = useQuery({
    queryKey: ['report-messages'],
    queryFn: () => getMessage(integrationData?.id!),
    enabled: !!integrationData?.id,
  });

  console.log(JSON.stringify(reportMessages));

  const insets = useSafeAreaInsets();

  // Função para regionalizar e formatar a data (UTC 'Z' -> Local)
  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date
      .toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(',', ''); // Formato final: "27/04/2026 14:02"
  };

  // Função para formatar os valores para exibição limpa
  const renderValue = (key: string, value: any) => {
    // Caso específico para o objeto de localização da imagem (País - Estado - Município)
    if (key === 'localizacao' && value && typeof value === 'object') {
      const parts = [
        value.evento_pais_ocorrencia,
        value.evento_estado_ocorrencia,
        value.evento_municipio_ocorrencia,
      ].filter(Boolean);
      return parts.join(' · ');
    }

    if (Array.isArray(value)) {
      return value
        .map((v) => String(v).replace(/_/g, ' '))
        .join(', ')
        .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitaliza
    }

    // Formatar datas dentro do formulário
    if (
      key.includes('data') &&
      typeof value === 'string' &&
      value.includes('T')
    ) {
      // Se quiser apenas a data: return new Date(value).toLocaleDateString('pt-BR');
      return formatDate(value).split(' ')[0];
    }

    // Tratamento genérico para strings (removendo underscores)
    if (typeof value === 'string') {
      const cleanString = value.replace(/_/g, ' ');
      return cleanString.charAt(0).toUpperCase() + cleanString.slice(1);
    }

    return String(value);
  };

  const handleEnviarMensagem = async () => {
    if (mensagemDigitada.trim() === '') return;

    if (!reportMessages?.id) {
      console.error('Erro: ID do relatório não encontrado.');
      return;
    }

    setIsSending(true);

    try {
      await sendMessage(
        {
          message: mensagemDigitada,
        },
        reportMessages.id
      );

      console.log('Mensagem enviada com sucesso');

      setMensagemDigitada('');
      queryClient.invalidateQueries({ queryKey: ['report-messages'] });
    } catch (e) {
      console.log('Erro ao enviar mensagem:', e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingTop: 24,
            paddingHorizontal: 20,
            paddingBottom: Math.max(insets.bottom, 24),
            height: '90%', // Ocupa boa parte da tela como a imagem sugere
          }}
        >
          {/* Cabeçalho */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text
              style={{ fontSize: 22, fontWeight: 'bold', color: '#111827' }}
            >
              Detalhes do sinal
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <Text style={{ color: '#6B7280', fontSize: 24 }}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Linha Divisória */}
          <View
            style={{
              height: 1,
              backgroundColor: '#E5E7EB',
              width: '100%',
              marginBottom: 16,
            }}
          />

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#007BFF"
              style={{ marginVertical: 40 }}
            />
          ) : data ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Data e Tags Superiores */}
              <Text
                style={{ color: '#6B7280', fontSize: 14, marginBottom: 12 }}
              >
                {formatDate(data.createdAt)}
              </Text>

              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
                <View style={[styles.badge, { backgroundColor: '#D32F2F' }]}>
                  <Text
                    style={{ color: 'white', fontWeight: '600', fontSize: 12 }}
                  >
                    {data.reportType === 'POSITIVE' ? 'Com sinal' : 'Sem sinal'}
                  </Text>
                </View>

                {integrationData?.integrationSummary
                  ?.externalSignalStageLabel && (
                  <View style={[styles.badge, styles.badgeOutline]}>
                    <Text
                      style={{
                        color: '#0ea5e9',
                        fontWeight: '600',
                        fontSize: 12,
                      }}
                    >
                      {
                        integrationData?.integrationSummary
                          ?.externalSignalStageLabel
                      }
                    </Text>
                  </View>
                )}
              </View>

              {/* Cartões do Formulário */}
              {Object.entries(data.formResponse || {}).map(([key, value]) => {
                // Pula campos vazios para manter a UI limpa, se desejar
                if (value === '' || value === null) return null;

                return (
                  <View key={key} style={styles.card}>
                    <Text style={styles.cardLabel}>
                      {LABEL_MAP[key] || key.replace(/_/g, ' ')}
                    </Text>
                    <Text style={styles.cardValue}>
                      {renderValue(key, value)}
                    </Text>
                  </View>
                );
              })}

              {/* Seção de Acompanhamento */}
              <View style={{ marginTop: 24 }}>
                <Text style={styles.title}>Acompanhamento</Text>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
                >
                  {integrationData?.integrationSummary?.status === 'sent' && (
                    <View
                      style={[styles.badge, { backgroundColor: '#2e7d32' }]}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: 12,
                        }}
                      >
                        Enviado ao sistema externo
                      </Text>
                    </View>
                  )}
                  {integrationData?.integrationSummary
                    ?.externalSignalStageLabel && (
                    <View style={[styles.badge, styles.badgeOutline]}>
                      <Text
                        style={{
                          color: '#0ea5e9',
                          fontWeight: '600',
                          fontSize: 12,
                        }}
                      >
                        Estado no sistema externo:{' '}
                        {
                          integrationData.integrationSummary
                            ?.externalSignalStageLabel
                        }
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {reportMessages?.messages && (
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.title}>Menssagens</Text>
                  {reportMessages.messages.map((mensagem) => {
                    const isRecebido = mensagem.direction === 'inbound';

                    return (
                      <View
                        key={mensagem.id}
                        style={
                          isRecebido
                            ? styles.balaoRecebido
                            : styles.balaoEnviado
                        }
                      >
                        {/* Texto da mensagem */}
                        <Text
                          style={
                            isRecebido
                              ? styles.textoRecebido
                              : styles.textoEnviado
                          }
                        >
                          {mensagem.body}
                        </Text>

                        {/* Texto da data/hora */}
                        <Text
                          style={
                            isRecebido
                              ? styles.dataRecebida
                              : styles.dataEnviada
                          }
                        >
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
                        // Desabilita a cor se estiver vazio OU se estiver enviando
                        (!mensagemDigitada.trim() || isSending) &&
                          styles.sendButtonDisabled,
                      ]}
                      onPress={handleEnviarMensagem}
                      // Desabilita o clique se estiver vazio OU se estiver enviando
                      disabled={!mensagemDigitada.trim() || isSending}
                    >
                      {/* Mostra a bolinha se estiver enviando, senão mostra o texto */}
                      {isSending ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.sendButtonText}>Enviar</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          ) : (
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
              Nenhum dado encontrado.
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    color: '#111827',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgeOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
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
  textoRecebido: {
    color: '#111827',
    fontSize: 15,
  },
  textoEnviado: {
    color: '#FFFFFF',
    fontSize: 15,
  },
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
    borderTopColor: '#E5E7EB', // Linha cinza separando o chat do input
    paddingTop: 12,
    marginTop: 8,
  },
  input: {
    flex: 1, // Faz o input ocupar todo o espaço livre
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12, // Necessário no iOS para alinhar o texto no multiline
    paddingBottom: 12,
    fontSize: 15,
    color: '#111827',
    maxHeight: 100, // Impede que o input cresça infinitamente se o texto for gigante
  },
  sendButton: {
    backgroundColor: '#007AFF', // Azul
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#93C5FD', // Azul clarinho quando não há texto
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
