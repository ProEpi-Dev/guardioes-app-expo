import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ReportType } from '../../../types/report';

interface CardReportProps {
  data: ReportType;
}

export function CardReport({ data }: CardReportProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Reporte ID: {data.reportId}</Text>
      <Text style={styles.status}>Status: {data.externalSignalStageLabel}</Text>
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
