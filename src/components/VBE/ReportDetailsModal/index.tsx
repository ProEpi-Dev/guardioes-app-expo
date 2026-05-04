import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReportDetailsResponse, ReportTypee } from '../../../types/report';

interface Props {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  data?: ReportDetailsResponse;
  integrationData?: ReportTypee; // <-- Recebe os dados de acompanhamento da lista
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
  // integrationData,
}: Props) {
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

                {/* {integrationData?.externalSignalStageLabel && (
                  <View style={[styles.badge, styles.badgeOutline]}>
                    <Text
                      style={{
                        color: '#0ea5e9',
                        fontWeight: '600',
                        fontSize: 12,
                      }}
                    >
                      {integrationData.externalSignalStageLabel}
                    </Text>
                  </View>
                )} */}
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
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: 12,
                  }}
                >
                  Acompanhamento
                </Text>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
                >
                  {/* {integrationData?.status === 'sent' && (
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
                  {integrationData?.externalSignalStageLabel && (
                    <View style={[styles.badge, styles.badgeOutline]}>
                      <Text
                        style={{
                          color: '#0ea5e9',
                          fontWeight: '600',
                          fontSize: 12,
                        }}
                      >
                        Estado no sistema externo:{' '}
                        {integrationData.externalSignalStageLabel}
                      </Text>
                    </View>
                  )} */}
                </View>
              </View>
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
});
