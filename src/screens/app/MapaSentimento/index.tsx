import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { MapWithFeeling } from '../../../components/MapWithFeeling';
import { SentimentModal } from '../../../components/SentimentModal';
import { useSentimentLogic } from '../../../hooks/useSentimentLogic';
import { CustomHeader } from '../../../components/CustomHeader';
import { useAuth } from '../../../contexts/AuthContext'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function MapaSentimento() {
  const { user } = useAuth(); 
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 60 + insets.bottom;

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
    handleSubmitForm
  } = useSentimentLogic();

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>
      
      <View style={StyleSheet.absoluteFillObject}>
        <MapWithFeeling 
          onFeelingSelected={onFeelingSelected} 
          points={mapPoints}
          loading={loadingPoints}
          bottomOffset={TAB_BAR_HEIGHT}
        />
      </View>

      <CustomHeader userName={user?.name} />

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