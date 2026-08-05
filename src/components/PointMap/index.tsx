import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUserLocationQuery } from '../../hooks/useUserLocationQuery';

interface PointMapProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (coords: { latitude: number; longitude: number }) => void;
  initialCoords?: { latitude: number; longitude: number } | null;
}

export function PointMapModal({
  visible,
  onClose,
  onConfirm,
  initialCoords,
}: PointMapProps) {
  const insets = useSafeAreaInsets();
  const { location: userLocation, isLoading } = useUserLocationQuery();

  const [coordenadaSelecionada, setCoordenadaSelecionada] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialCoords) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCoordenadaSelecionada(initialCoords);
      } else if (userLocation) {
        setCoordenadaSelecionada({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        });
      }
    }
  }, [visible, userLocation, initialCoords]);

  const handleRegiaoAlterada = (regiao: Region) => {
    setCoordenadaSelecionada({
      latitude: regiao.latitude,
      longitude: regiao.longitude,
    });
  };

  const handleConfirmar = () => {
    if (coordenadaSelecionada) {
      onConfirm(coordenadaSelecionada);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {isLoading && !coordenadaSelecionada ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2E97BE" />
            <Text style={{ marginTop: 10 }}>Buscando localização...</Text>
          </View>
        ) : (
          coordenadaSelecionada && (
            <>
              <MapView
                style={styles.mapa}
                initialRegion={{
                  latitude: coordenadaSelecionada.latitude,
                  longitude: coordenadaSelecionada.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                onRegionChangeComplete={handleRegiaoAlterada}
                showsUserLocation={true}
              />

              {/* Pin Fixo */}
              <View style={styles.marcadorFixo} pointerEvents="none">
                <Feather name="map-pin" size={40} color="#D32F2F" />
                <View style={styles.pontoDeContato} />
              </View>

              {/* Painel Inferior */}
              <View
                style={[
                  styles.painelInferior,
                  { paddingBottom: Math.max(insets.bottom, 20) },
                ]}
              >
                <View style={styles.headerPainel}>
                  <Text style={styles.tituloPainel}>Confirme o Local</Text>
                  <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
                    <Feather name="x" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.botaoConfirmar}
                  onPress={handleConfirmar}
                >
                  <Text style={styles.textoBotao}>Confirmar Localização</Text>
                </TouchableOpacity>
              </View>
            </>
          )
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapa: { flex: 1 },
  marcadorFixo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    alignItems: 'center',
  },
  pontoDeContato: {
    width: 6,
    height: 6,
    backgroundColor: '#111827',
    borderRadius: 3,
    marginTop: -4,
  },
  painelInferior: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  headerPainel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloPainel: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  botaoConfirmar: {
    backgroundColor: '#2E97BE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBotao: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
