import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getMessage } from '../../../services/reports';
import { ReportDetailsResponse, ReportTypee } from '../../../types/report';
import { ChatSection } from './ChatSection';
import { ReportInfo } from './ReportInfo';

interface Props {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  data?: ReportDetailsResponse;
  integrationData?: ReportTypee;
}

export function ReportDetailsModal({
  visible,
  onClose,
  loading,
  data,
  integrationData,
}: Props) {
  const insets = useSafeAreaInsets();

  const { data: reportMessages } = useQuery({
    queryKey: ['report-messages'],
    queryFn: () => getMessage(integrationData?.id!),
    enabled: !!integrationData?.id,
  });

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString)
      .toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(',', '');
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
            height: '90%',
          }}
        >
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
              <ReportInfo
                data={data}
                integrationData={integrationData}
                formatDate={formatDate}
              />
              <ChatSection
                reportMessages={reportMessages}
                formatDate={formatDate}
              />
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
