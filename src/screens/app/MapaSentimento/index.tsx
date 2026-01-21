import React from 'react';
import { StatusBar } from 'react-native';
import { MapWithFeeling } from '../../../components/MapWithFeeling';
import { SentimentModal } from '../../../components/SentimentModal';
import { useSentimentLogic } from '../../../hooks/useSentimentLogic';

export function MapaSentimento() {
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
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>
      
      <MapWithFeeling 
        onFeelingSelected={onFeelingSelected} 
        points={mapPoints}
        loading={loadingPoints}
      />

      <SentimentModal 
        visible={showForm}
        onClose={() => setShowForm(false)}
        loading={loadingForm}
        sending={sending}
        formDefinition={formDefinition}
        onFormChange={setFormValues}
        onSubmit={handleSubmitForm}
      />
    </>
  );
}