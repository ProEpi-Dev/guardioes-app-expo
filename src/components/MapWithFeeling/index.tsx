import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import translate from '../../locales/i18n';

interface MapWithFeelingProps {
  onFeelingSelected?: (feeling: 'good' | 'bad') => void;
}

export const MapWithFeeling: React.FC<MapWithFeelingProps> = ({ onFeelingSelected }) => {
  const insets = useSafeAreaInsets();
  const [region] = useState<Region>({
    // Brasília como centro padrão
    latitude: -15.8194724,
    longitude: -47.924146,
    latitudeDelta: 1.0,
    longitudeDelta: 1.0,
  });

  const handleFeelingSelection = (feeling: 'good' | 'bad') => {
    if (onFeelingSelected) {
      onFeelingSelected(feeling);
    } else {
      // Comportamento padrão se não houver callback
      const message = feeling === 'good' 
        ? translate('report.goodChoice') || 'BEM'
        : translate('report.badChoice') || 'MAL';
      Alert.alert('Sentimento registrado', `Você selecionou: ${message}`);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="standard"
      />
      
      <View style={[styles.cardContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {translate('home.userHowYouFelling') || 'Como você se sente hoje?'}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.goodButton]}
              onPress={() => handleFeelingSelection('good')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>
                {translate('report.goodChoice') || 'BEM'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.badButton]}
              onPress={() => handleFeelingSelection('bad')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>
                {translate('report.badChoice') || 'MAL'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#32323b',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  goodButton: {
    backgroundColor: '#2E97BE',
  },
  badButton: {
    backgroundColor: '#dd821a',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

