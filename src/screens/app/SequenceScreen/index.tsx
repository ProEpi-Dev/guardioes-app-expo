import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { CustomHeader } from '../../../components/CustomHeader';
import { useAuth } from '../../../contexts/AuthContext';
import { useStreaks } from '../../../hooks/useStreaks';
import translate from '../../../locales/i18n';
import { StatCard } from '../../../components/StatCard';
import { StreakCalendar } from '../../../components/StreakCalendar';

import { useParticipation } from '../../../contexts/ParticipationContext';

export function SequenceScreen() {
  const { user } = useAuth();
  const tabBarHeight = useBottomTabBarHeight();
  const { contextId, participationId } = useParticipation();

  const {
    currentStreak,
    longestStreak,
    totalReports,
    markedDates,
    loading,
    fetchMonthData,
  } = useStreaks(contextId || 0, participationId || 0);

  // Utilizando o ternary (condicional) com as traduções
  const textoDia =
    currentStreak === 1
      ? translate('sequence.day')
      : translate('sequence.days');
  const textoSeguido =
    currentStreak === 1
      ? translate('sequence.inarow')
      : translate('sequence.inarows');
  const textoMaior =
    longestStreak === 1
      ? translate('sequence.day')
      : translate('sequence.days');
  const textoTotal =
    totalReports === 1 ? translate('sequence.day') : translate('sequence.days');

  const currentMonthRef = useRef({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  useFocusEffect(
    useCallback(() => {
      if (participationId) {
        fetchMonthData(
          currentMonthRef.current.year,
          currentMonthRef.current.month
        );
      }
    }, [fetchMonthData, participationId])
  );

  return (
    <View style={styles.container}>
      <CustomHeader userName={user?.name} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            {translate('sequence.participation')}{' '}
            <Text style={styles.messageHighlight}>
              {currentStreak} {textoDia}
            </Text>{' '}
            {textoSeguido}.
          </Text>
        </View>

        <StreakCalendar
          markedDates={markedDates}
          loading={loading}
          onMonthChange={(year, month) => {
            currentMonthRef.current = { year, month };
            fetchMonthData(year, month);
          }}
        />

        <View style={styles.statsContainer}>
          <StatCard
            label={translate('sequence.longestStreak')}
            value={`${longestStreak || 0} ${textoMaior}`}
          />
          <StatCard
            label={translate('sequence.totalParticipation')}
            value={`${totalReports || 0} ${textoTotal}`}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  messageText: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'center',
  },
  messageHighlight: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#2C3E50',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});
