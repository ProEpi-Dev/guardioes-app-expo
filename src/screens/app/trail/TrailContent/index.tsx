import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Accordion from '../../../../components/Accordion';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTrailParamList } from '../../../../types/trail';

type Props = NativeStackScreenProps<RootTrailParamList, 'Accordion'>;

export default function TrailContent ({route}: Props) {

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Accordion title="Como funciona o pagamento?">
          <Text>
            Aceitamos cartões de crédito, débito e PIX. O processamento é instantâneo.
          </Text>
        </Accordion>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  scrollContent: {
    paddingVertical: 0,
  }
});