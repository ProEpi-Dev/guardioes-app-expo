import React, { useEffect, useState } from 'react';
import {
  Alert,
  DeviceEventEmitter,
  FlatList,
  RefreshControl,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { CustomHeader } from '../../../../components/CustomHeader';
import { useAuth } from '../../../../contexts/AuthContext';
import translate from '../../../../locales/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeelingCard } from '../../../../components/FeelingCard';
import { useSentimentLogic } from '../../../../hooks/useSentimentLogic';
import { SentimentModal } from '../../../../components/SentimentModal';
import { useVbeReports } from '../../../../hooks/useVbeReport';
import { CardReport } from '../../../../components/VBE/cardReport';
import { useQuery } from '@tanstack/react-query';
import { getReportById } from '../../../../services/reports';
import { ReportDetailsModal } from '../../../../components/VBE/ReportDetailsModal';

export function Vbe() {
  const { user } = useAuth();
  const {
    onFeelingSelected,
    showForm,
    setShowForm,
    formDefinition,
    formTitle,
    loadingForm,
    sending,
    setFormValues,
    handleSubmitForm,
    isCompliant: logicCompliant,
  } = useSentimentLogic();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 60 + insets.bottom;
  const [isCompliant, setIsCompliant] = useState(logicCompliant);
  const { report, refetch, isRefetching } = useVbeReports();
  const [activeFilter, setActiveFilter] = useState<
    'Todos' | 'Informado' | 'Processado'
  >('Todos');
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const { data: reportDetails, isFetching: isFetchingDetails } = useQuery({
    queryKey: ['report-details', selectedReportId],
    queryFn: () => getReportById(selectedReportId!),
    enabled: !!selectedReportId,
  });

  useEffect(() => {
    setIsCompliant(logicCompliant);
  }, [logicCompliant]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'force_compliance_update',
      (status) => {
        setIsCompliant(status);
      }
    );
    return () => subscription.remove();
  }, []);

  const handleFeelingSelection = (feeling: 'good' | 'bad') => {
    if (onFeelingSelected) {
      onFeelingSelected(feeling);
    } else {
      const message =
        feeling === 'good'
          ? translate('report.goodChoice')
          : translate('report.badChoice');
      Alert.alert('Sentimento registrado', `Você selecionou: ${message}`);
    }
  };

  const filteredReports =
    report?.filter((item) => {
      if (activeFilter === 'Todos') {
        return true;
      }

      if (activeFilter === 'Informado') {
        return item.externalSignalStageLabel === 'Informado';
      } else {
        return item.externalSignalStageLabel === 'Processado';
      }
    }) || [];

  const selectedIntegrationData = report?.find(
    (r) => r.reportId === selectedReportId
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f5f7' }}>
      <CustomHeader userName={user?.name} />

      <View style={{ flex: 1, paddingBottom: TAB_BAR_HEIGHT }}>
        <View style={{ height: 180, width: '100%', zIndex: 10 }}>
          <FeelingCard
            onFeelingSelected={handleFeelingSelection}
            isCompliant={isCompliant}
            padBottom={0}
            bottomOffset={0}
            goodButtonText="NADA OCORREU"
            badButtonText="INFORMAR"
            title="Quer informar um sinal de alerta?"
          />
        </View>

        <View style={{ width: '100%', marginHorizontal: 20, marginBottom: 10 }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Meus Reports</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 14,
            backgroundColor: '#E3E3E8',
            borderRadius: 8,
            padding: 4,
            marginBottom: 15,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveFilter('Todos')}
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor:
                activeFilter === 'Todos' ? '#FFFFFF' : 'transparent',
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontWeight: activeFilter === 'Todos' ? 'bold' : 'normal',
                color: activeFilter === 'Todos' ? '#000000' : '#666666',
              }}
            >
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter('Informado')}
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor:
                activeFilter === 'Informado' ? '#FFFFFF' : 'transparent',
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontWeight: activeFilter === 'Informado' ? 'bold' : 'normal',
                color: activeFilter === 'Informado' ? '#000000' : '#666666',
              }}
            >
              Informado
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter('Processado')}
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor:
                activeFilter === 'Processado' ? '#FFFFFF' : 'transparent',
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontWeight: activeFilter === 'Processado' ? 'bold' : 'normal',
                color: activeFilter === 'Processado' ? '#000000' : '#666666',
              }}
            >
              Processado
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ height: 350, width: '100%', paddingBottom: insets.bottom }}
        >
          <FlatList
            data={filteredReports}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedReportId(item.reportId)}
              >
                <CardReport data={item} />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 50 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={['#007BFF']}
                tintColor="#007BFF"
              />
            }
            ListEmptyComponent={
              <Text
                style={{ textAlign: 'center', marginTop: 30, color: '#666' }}
              >
                Nenhum reporte encontrado.
              </Text>
            }
          />
        </View>
      </View>

      <SentimentModal
        visible={showForm}
        onClose={() => setShowForm(false)}
        loading={loadingForm}
        sending={sending}
        formDefinition={formDefinition}
        onFormChange={setFormValues}
        onSubmit={handleSubmitForm}
        title={formTitle}
      />

      <ReportDetailsModal
        visible={selectedReportId !== null}
        loading={isFetchingDetails}
        data={reportDetails}
        integrationData={selectedIntegrationData}
        onClose={() => setSelectedReportId(null)}
      />
    </View>
  );
}
