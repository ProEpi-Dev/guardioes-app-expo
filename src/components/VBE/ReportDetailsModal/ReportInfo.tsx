import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReportDetailsResponse, ReportTypee } from '../../../types/report';

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

interface ReportInfoProps {
  data: ReportDetailsResponse;
  integrationData?: ReportTypee;
  formatDate: (isoString?: string) => string;
}

export function ReportInfo({
  data,
  integrationData,
  formatDate,
}: ReportInfoProps) {
  const renderValue = (key: string, value: any) => {
    if (key === 'localizacao' && value && typeof value === 'object') {
      const parts = [
        value.evento_pais_ocorrencia,
        value.evento_estado_ocorrencia,
        value.evento_municipio_ocorrencia,
      ].filter(Boolean);
      return parts.join(' · ');
    }
    if (key === 'geo_location') {
      const parts = [value.latitude, value.longitude].filter(Boolean);
      return parts.join(' , ');
    }
    if (Array.isArray(value)) {
      return value
        .map((v) => String(v).replace(/_/g, ' '))
        .join(', ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (
      key.includes('data') &&
      typeof value === 'string' &&
      value.includes('T')
    ) {
      return formatDate(value).split(' ')[0];
    }
    if (typeof value === 'string') {
      const cleanString = value.replace(/_/g, ' ');
      return cleanString.charAt(0).toUpperCase() + cleanString.slice(1);
    }
    return String(value);
  };

  return (
    <View>
      <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 12 }}>
        {formatDate(data.createdAt)}
      </Text>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
        <View style={[styles.badge, { backgroundColor: '#D32F2F' }]}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>
            {data.reportType === 'POSITIVE' ? 'Com sinal' : 'Sem sinal'}
          </Text>
        </View>

        {integrationData?.integrationSummary?.externalSignalStageLabel && (
          <View style={[styles.badge, styles.badgeOutline]}>
            <Text style={{ color: '#0ea5e9', fontWeight: '600', fontSize: 12 }}>
              {integrationData.integrationSummary.externalSignalStageLabel}
            </Text>
          </View>
        )}
      </View>

      {Object.entries(data.formResponse || {}).map(([key, value]) => {
        if (value === '' || value === null) return null;
        return (
          <View key={key} style={styles.card}>
            <Text style={styles.cardLabel}>
              {LABEL_MAP[key] || key.replace(/_/g, ' ')}
            </Text>
            <Text style={styles.cardValue}>{renderValue(key, value)}</Text>
          </View>
        );
      })}

      <View style={{ marginTop: 24 }}>
        <Text style={styles.title}>Acompanhamento</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {integrationData?.integrationSummary?.status === 'sent' && (
            <View style={[styles.badge, { backgroundColor: '#2e7d32' }]}>
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>
                Enviado ao sistema externo
              </Text>
            </View>
          )}
          {integrationData?.integrationSummary?.externalSignalStageLabel && (
            <View style={[styles.badge, styles.badgeOutline]}>
              <Text
                style={{ color: '#0ea5e9', fontWeight: '600', fontSize: 12 }}
              >
                Estado no sistema externo:{' '}
                {integrationData.integrationSummary.externalSignalStageLabel}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
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
  cardLabel: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  cardValue: { fontSize: 16, color: '#111827' },
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
});
