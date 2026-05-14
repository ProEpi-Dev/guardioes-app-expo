import React, { useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import translate, { getCurrentLocale } from '../../locales/i18n';

interface SuccessOverlayProps {
  visible: boolean;
  onAnimationEnd: () => void;
}

export function SuccessOverlay({
  visible,
  onAnimationEnd,
}: SuccessOverlayProps) {
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.5));

  const diaDaSemana = new Date().toLocaleDateString(
    getCurrentLocale() || 'pt-BR',
    { weekday: 'long' }
  );
  const diaCapitalizado =
    diaDaSemana.charAt(0).toUpperCase() + diaDaSemana.slice(1);

  useEffect(() => {
    if (visible) {
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

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          onAnimationEnd();
          scaleAnim.setValue(0.5);
        });
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, scaleAnim]);

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.successOverlay]}>
      <Animated.View
        style={[
          styles.successCard,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>
          {translate('vbe.successAnimation', { day: diaCapitalizado })}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  successOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999,
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
  successEmoji: { fontSize: 50, marginBottom: 10 },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
});
