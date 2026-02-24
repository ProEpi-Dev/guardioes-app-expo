import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, StatusBar, StyleSheet, View } from 'react-native';
import { MapWithFeeling } from '../../../components/MapWithFeeling';
import { SentimentModal } from '../../../components/SentimentModal';
import { useSentimentLogic } from '../../../hooks/useSentimentLogic';
import { useUserLocationQuery } from '../../../hooks/useUserLocationQuery';
import { CustomHeader } from '../../../components/CustomHeader';
import { useAuth } from '../../../contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertModal } from '../../../components/AlertModal';

export function MapaSentimento() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 60 + insets.bottom;
  const { location } = useUserLocationQuery();
  
  const {
    mapPoints,
    loadingPoints,
    onFeelingSelected,
    showForm,
    setShowForm,
    formDefinition,
    loadingForm,
    sending,
    setFormValues,
    handleSubmitForm,
    isCompliant: logicCompliant
  } = useSentimentLogic();
  
  const [isCompliant, setIsCompliant] = useState(logicCompliant);

  useEffect(() => {
    setIsCompliant(logicCompliant);
  }, [logicCompliant]);
  
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('force_compliance_update', (status) => {
      setIsCompliant(status);
    });
    return () => subscription.remove();
  }, []);
  
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>

      <View style={StyleSheet.absoluteFillObject}>
        <MapWithFeeling
          userLocation={location}
          onFeelingSelected={onFeelingSelected}
          points={mapPoints}
          loading={loadingPoints}
          bottomOffset={TAB_BAR_HEIGHT}
          isCompliant={isCompliant}
        />
      </View>

      <CustomHeader userName={user?.name} />

      {!isCompliant && (
        <View style={StyleSheet.absoluteFillObject}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center' }}>
             <AlertModal />
          </View>
        </View>
      )}

      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: TAB_BAR_HEIGHT }}>
        <SentimentModal 
          visible={showForm}
          onClose={() => setShowForm(false)}
          loading={loadingForm}
          sending={sending}
          formDefinition={formDefinition}
          onFormChange={setFormValues}
          onSubmit={handleSubmitForm}
        />
      </View>
    </View>
  );
}