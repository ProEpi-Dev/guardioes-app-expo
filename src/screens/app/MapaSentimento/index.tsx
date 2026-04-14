import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  DeviceEventEmitter,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MapWithFeeling } from '../../../components/MapWithFeeling';
import { SentimentModal } from '../../../components/SentimentModal';
import { useSentimentLogic } from '../../../hooks/useSentimentLogic';
import { useUserLocationQuery } from '../../../hooks/useUserLocationQuery';
import { CustomHeader } from '../../../components/CustomHeader';
import { useAuth } from '../../../contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertModal } from '../../../components/AlertModal';
import { useStreaks } from '../../../hooks/useStreaks';
import { useParticipation } from '../../../contexts/ParticipationContext';

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
    formTitle,
    loadingForm,
    sending,
    setFormValues,
    handleSubmitForm,
    isCompliant: logicCompliant,
    showSuccessAnimation,
    setShowSuccessAnimation,
    currentStreakCount,
  } = useSentimentLogic();

  const { contextId, participationId } = useParticipation();

  const { currentStreak } = useStreaks(contextId || 0, participationId || 0);

  const [isCompliant, setIsCompliant] = useState(logicCompliant);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const diaDaSemana = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
  });
  const diaCapitalizado =
    diaDaSemana.charAt(0).toUpperCase() + diaDaSemana.slice(1);

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

  useEffect(() => {
    if (showSuccessAnimation) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      // Esconde automaticamente após 3.5 segundos
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccessAnimation(false);
          scaleAnim.setValue(0.5); // reseta para a próxima vez
        });
      }, 3500);
    }
  }, [showSuccessAnimation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

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
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.2)',
              justifyContent: 'center',
            }}
          >
            <AlertModal />
          </View>
        </View>
      )}

      {showSuccessAnimation && (
        <View style={[StyleSheet.absoluteFillObject, styles.successOverlay]}>
          <Animated.View
            style={[
              styles.successCard,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.successEmoji}>✅</Text>
            <Text style={styles.successTitle}>{diaCapitalizado} Marcado!</Text>
            <Text style={styles.successSubtitle}>
              Sequência atual: {currentStreak} dia(s) 🔥
            </Text>
          </Animated.View>
        </View>
      )}

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

const styles = StyleSheet.create({
  successOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999, // Garante que fique por cima do mapa e modais
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  successEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 8,
    fontWeight: '500',
  },
});
