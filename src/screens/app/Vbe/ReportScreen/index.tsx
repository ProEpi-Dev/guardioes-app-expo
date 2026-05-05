import React, { useEffect, useState, useMemo } from 'react';
import {
  Alert,
  DeviceEventEmitter,
  FlatList,
  RefreshControl,
  Text,
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
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
    showSuccessAnimation,
    setShowSuccessAnimation,
  } = useSentimentLogic();

  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 60 + insets.bottom;
  const [isCompliant, setIsCompliant] = useState(logicCompliant);
  const { report, refetch, isRefetching } = useVbeReports();

  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const { data: reportDetails, isFetching: isFetchingDetails } = useQuery({
    queryKey: ['report-details', selectedReportId],
    queryFn: () => getReportById(selectedReportId!),
    enabled: !!selectedReportId,
  });

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.5));

  const diaDaSemana = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
  });
  const diaCapitalizado =
    diaDaSemana.charAt(0).toUpperCase() + diaDaSemana.slice(1);

  useEffect(() => {
    if (showSuccessAnimation) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccessAnimation(false);
          scaleAnim.setValue(0.5);
        });
      }, 3500);
    }
  }, [showSuccessAnimation]);

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

  // 1. GERANDO AS OPÇÕES DO FILTRO DINAMICAMENTE
  const filterOptions = useMemo(() => {
    if (!report) return ['Todos'];

    const labels = report.map(
      (item) => item.integrationSummary?.externalSignalStageLabel
    );
    const validLabels = labels.filter((label): label is string => !!label);
    const uniqueLabels = Array.from(new Set(validLabels));

    return ['Todos', ...uniqueLabels];
  }, [report]);

  // 2. APLICANDO O FILTRO NA LISTA
  const filteredReports = useMemo(() => {
    if (!report) return [];

    if (activeFilter === 'Todos') {
      return report;
    }

    return report.filter(
      (item) =>
        item.integrationSummary?.externalSignalStageLabel === activeFilter
    );
  }, [report, activeFilter]);

  const selectedIntegrationData = report?.find(
    (r) => r.id === selectedReportId
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
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Meus Sinais</Text>
        </View>

        {/* CONTAINER DOS BOTÕES DE FILTRO */}
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
          {/* Mapeando os botões dinamicamente baseado nos dados reais */}
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setActiveFilter(option)}
              style={{
                flex: 1,
                paddingVertical: 8,
                alignItems: 'center',
                backgroundColor:
                  activeFilter === option ? '#FFFFFF' : 'transparent',
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontWeight: activeFilter === option ? 'bold' : 'normal',
                  color: activeFilter === option ? '#000000' : '#666666',
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={{ height: 350, width: '100%', paddingBottom: insets.bottom }}
        >
          <FlatList
            data={filteredReports}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedReportId(item.id)}>
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

      {showSuccessAnimation && (
        <View style={[StyleSheet.absoluteFillObject, styles.successOverlay]}>
          <Animated.View
            style={[
              styles.successCard,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.successEmoji}>✅</Text>
            <Text style={styles.successTitle}>{diaCapitalizado} Marcado!</Text>
          </Animated.View>
        </View>
      )}

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

const styles = StyleSheet.create({
  successOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  successEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
});
