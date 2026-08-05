import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export const LoadingOverlay: React.FC = () => {
  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#2E97BE" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
  },
});
