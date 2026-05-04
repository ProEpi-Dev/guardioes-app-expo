import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ReportTypee } from '../../../types/report';

interface CardReportProps {
  data: ReportTypee;
}

export function CardReport({ data }: CardReportProps) {
  // Função para formatar a data para o padrão brasileiro
  const formatarData = (dataISO: string | number) => {
    if (!dataISO) return 'Data indisponível';

    const date = new Date(dataISO);

    // Retorna no formato: 29/04/2026 às 17:30
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      {/* Trocamos o ID pela Data formatada */}
      <Text style={styles.title}>{formatarData(data.createdAt)}</Text>
      <Text style={styles.status}>{data.previewText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 5,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    color: '#666',
  },
});
