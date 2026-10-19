import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useOfflineSync } from '../../hooks/useOfflineSync';

interface OfflineBannerProps {
  isOffline: boolean;
}

export function OfflineBanner({ isOffline }: OfflineBannerProps) {
  const { pendingCount } = useOfflineSync();

  if (!isOffline) return null;

  const pendingText =
    pendingCount > 0
      ? ` · ${pendingCount} ${pendingCount === 1 ? 'registro aguardando' : 'registros aguardando'} envio`
      : '';

  return (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineText}>
        Sem conexão com a internet.{pendingText}
      </Text>
      <Text style={styles.offlineSubtext}>
        Apenas o registro de saúde está disponível.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: '#ff3333',
    padding: 10,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    elevation: 10,
  },
  offlineText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  offlineSubtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
});
