import React, { useEffect, useState } from 'react';
import { Alert, DeviceEventEmitter, View } from 'react-native';
import { CustomHeader } from '../../../../components/CustomHeader';
import { useAuth } from '../../../../contexts/AuthContext';
import translate from '../../../../locales/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeelingCard } from '../../../../components/FeelingCard';
import { useSentimentLogic } from '../../../../hooks/useSentimentLogic';
import { SentimentModal } from '../../../../components/SentimentModal';

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
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <CustomHeader userName={user?.name} />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingBottom: TAB_BAR_HEIGHT + 60,
        }}
      >
        <FeelingCard
          onFeelingSelected={handleFeelingSelection}
          isCompliant={isCompliant}
          padBottom={463}
          bottomOffset={0}
          goodButtonText="NADA OCORREU"
          badButtonText="INFORMAR"
          title="Quer informar um sinal de alerta?"
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: TAB_BAR_HEIGHT,
          }}
        >
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
      </View>
    </View>
  );
}
