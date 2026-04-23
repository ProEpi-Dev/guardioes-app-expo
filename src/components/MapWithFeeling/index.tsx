import React, { useState, useRef, useMemo } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Heatmap } from 'react-native-maps';
import type { LocationObject } from 'expo-location';
import translate from '../../locales/i18n';
import { FeelingCard } from '../FeelingCard';
import { LoadingOverlay } from '../LoadingOverlay';
import { useMapLocation } from '../../hooks/useMapLocation';

interface MapPoint {
  id?: number;
  latitude: number;
  longitude: number;
  reportType?: 'POSITIVE' | 'NEGATIVE';
  [key: string]: any;
}

interface MapWithFeelingProps {
  userLocation?: LocationObject | null;
  onFeelingSelected?: (feeling: 'good' | 'bad') => void;
  points?: MapPoint[];
  loading?: boolean;
  bottomOffset?: number;
  isCompliant?: boolean;
}

export const MapWithFeeling: React.FC<MapWithFeelingProps> = ({
  userLocation = null,
  onFeelingSelected,
  points = [],
  loading = false,
  bottomOffset = 0,
  isCompliant = false,
}) => {
  const mapRef = useRef<MapView>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Usa o hook customizado para gerenciar a centralização do mapa
  const { region, setRegion } = useMapLocation(
    mapRef,
    userLocation,
    isMapReady
  );

  // Separa e sanitiza os pontos do Heatmap (Otimização de performance)
  const { positivePoints, negativePoints } = useMemo(() => {
    const pos: { latitude: number; longitude: number; weight: number }[] = [];
    const neg: { latitude: number; longitude: number; weight: number }[] = [];

    points.forEach((point) => {
      const lat =
        typeof point.latitude === 'number'
          ? point.latitude
          : parseFloat(point.latitude);
      const lng =
        typeof point.longitude === 'number'
          ? point.longitude
          : parseFloat(point.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      if (point.reportType === 'NEGATIVE') {
        neg.push({ latitude: lat, longitude: lng, weight: 1 });
      } else {
        pos.push({ latitude: lat, longitude: lng, weight: 1 });
      }
    });

    return { positivePoints: pos, negativePoints: neg };
  }, [points]);

  const handleFeelingSelection = (feeling: 'good' | 'bad') => {
    if (onFeelingSelected) {
      onFeelingSelected(feeling);
    } else {
      const message =
        feeling === 'good'
          ? translate('report.goodChoice')
          : translate('report.badChoice');
      Alert.alert('Sentimento registrado', `Você selecionou: ${message}`);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onMapReady={() => setIsMapReady(true)}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="standard"
        provider="google"
      >
        {positivePoints.length > 0 && (
          <Heatmap
            points={positivePoints}
            radius={50}
            opacity={0.8}
            gradient={{
              colors: ['rgba(0, 255, 47, 1)'],
              startPoints: [1],
              colorMapSize: 256,
            }}
          />
        )}

        {negativePoints.length > 0 && (
          <Heatmap
            points={negativePoints}
            radius={50}
            opacity={0.8}
            gradient={{
              colors: ['rgba(255,0,0,1)'],
              startPoints: [1],
              colorMapSize: 256,
            }}
          />
        )}
      </MapView>

      {loading && <LoadingOverlay />}

      <FeelingCard
        onFeelingSelected={handleFeelingSelection}
        isCompliant={isCompliant}
        bottomOffset={bottomOffset}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
