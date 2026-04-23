import React from 'react';
import { View } from 'react-native';
import { CustomHeader } from '../../../../components/CustomHeader';
import { useAuth } from '../../../../contexts/AuthContext';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SentimentModal } from '../../../../components/SentimentModal';
import { useSentimentLogic } from '../../../../hooks/useSentimentLogic';

export function Vbe() {
  const { user } = useAuth();

  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 60 + insets.bottom;

  const {
    showForm,
    setShowForm,
    formDefinition,
    formTitle,
    loadingForm,
    sending,
    setFormValues,
    handleSubmitForm,
  } = useSentimentLogic();
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <CustomHeader userName={user?.name} />
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
  );
}
