import React, { useEffect, useState } from 'react';
import {
  Alert,
  DeviceEventEmitter,
  FlatList,
  RefreshControl,
  Text,
  View,
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

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f5f7' }}>
      <CustomHeader userName={user?.name} />

      <View style={{ flex: 1, paddingBottom: TAB_BAR_HEIGHT }}>
        <View style={{ height: 180, width: '100%', zIndex: 10 }}>
          <FeelingCard
            onFeelingSelected={handleFeelingSelection}
            isCompliant={isCompliant}
            padBottom={0} // Zeramos isso porque a caixa já cuida do posicionamento
            bottomOffset={0}
            goodButtonText="NADA OCORREU"
            badButtonText="INFORMAR"
            title="Quer informar um sinal de alerta?"
          />
        </View>

        <View style={{ height: 350, width: '100%' }}>
          <FlatList
            data={report || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CardReport data={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
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
    </View>
  );
}
