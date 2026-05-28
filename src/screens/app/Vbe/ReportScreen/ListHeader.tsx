import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import translate from '../../../../locales/i18n';
import { colors } from '../../../../utils/colors';

interface ListHeaderProps {
  filterCount: number;
  onOpenFilter: () => void;
  onRefresh: () => void;
  isRefetching: boolean;
}

export function ListHeader({
  filterCount,
  onOpenFilter,
  onRefresh,
  isRefetching,
}: ListHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{translate('vbe.mySignals')}</Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButtonContainer}
          onPress={onRefresh}
          disabled={isRefetching}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.azulClaro, colors.azulEscuro]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButtonGradient}
          >
            {isRefetching ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Feather name="refresh-cw" size={20} color="white" />
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonContainer}
          onPress={onOpenFilter}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.azulClaro, colors.azulEscuro]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButtonGradient}
          >
            <Feather name="filter" size={20} color="white" />
            <Text style={styles.actionButtonText}>
              {translate('vbe.filter')}{' '}
              {filterCount > 0 ? `(${filterCount})` : ''}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 40,
    marginTop: 15,
  },
  title: { fontSize: 26, fontWeight: 'bold' },
  botaoFiltro: { alignSelf: 'flex-end' },
  actionButtonContainer: { borderRadius: 20, overflow: 'hidden' },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
