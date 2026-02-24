import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Region, Marker, Heatmap } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Supercluster from 'supercluster';
import type { ClusterFeature, PointFeature } from 'supercluster';
import type { LocationObject } from 'expo-location';
import translate from '../../locales/i18n';
import { colors } from '../../utils/colors';
import { useSentimentLogic } from '../../hooks/useSentimentLogic';

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

const DEFAULT_REGION: Region = {
  latitude: -15.8194724,
  longitude: -47.924146,
  latitudeDelta: 1.0,
  longitudeDelta: 1.0,
};

export const MapWithFeeling: React.FC<MapWithFeelingProps> = ({
  userLocation = null,
  onFeelingSelected,
  points = [],
  loading = false,
  bottomOffset = 0,
  isCompliant = false,
}) => {
  const location = userLocation;
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [isMapReady, setIsMapReady] = useState(false);
  const hasCenteredOnUser = useRef(false);
  // const { isCompliant } = useSentimentLogic();

  // Centralizar mapa quando tivermos localização e mapa pronto (ordem não importa)
  useEffect(() => {
    if (hasCenteredOnUser.current || !location?.coords || !isMapReady) return;
    const { latitude, longitude } = location.coords;
    const userRegion: Region = { latitude, longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 };
    setRegion(userRegion);
    let attempts = 0;
    const tryAnimate = () => {
      if (hasCenteredOnUser.current) return;
      if (mapRef.current) {
        hasCenteredOnUser.current = true;
        mapRef.current.animateToRegion(userRegion, 600);
        return;
      }
      if (attempts < 20) {
        attempts += 1;
        setTimeout(tryAnimate, 150);
      }
    };
    tryAnimate();
  }, [location, isMapReady]);

  const handleMapReady = () => setIsMapReady(true);

  // Separar pontos por tipo (POSITIVE e NEGATIVE)
  const { pointsPositive, pointsNegative } = useMemo(() => {
    const positive: any[] = [];
    const negative: any[] = [];

    points.forEach((point, index) => {
      if (!point.latitude || !point.longitude) return;

      const latitude = typeof point.latitude === 'number'
        ? point.latitude
        : parseFloat(point.latitude);
      const longitude = typeof point.longitude === 'number'
        ? point.longitude
        : parseFloat(point.longitude);

      if (isNaN(latitude) || isNaN(longitude)) return;

      const feature = {
        type: 'Feature' as const,
        properties: {
          id: point.id || `point-${index}`,
          reportType: point.reportType || 'POSITIVE',
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [longitude, latitude] as [number, number],
        },
      };

      if (point.reportType === 'NEGATIVE') {
        negative.push(feature);
      } else {
        positive.push(feature);
      }
    });

    return { pointsPositive: positive, pointsNegative: negative };
  }, [points]);

  // Criar duas instâncias do Supercluster - uma para cada tipo
  const clustererPositive = useRef(
    new Supercluster({
      radius: 80,
      minZoom: 5,
      maxZoom: 15,
      minPoints: 2,
    })
  ).current;

  const clustererNegative = useRef(
    new Supercluster({
      radius: 80,
      minZoom: 5,
      maxZoom: 15,
      minPoints: 2,
    })
  ).current;

  // Estado para rastrear se os pontos foram carregados
  const [pointsLoaded, setPointsLoaded] = useState(false);

  // Carregar pontos nos clusterers
  useEffect(() => {
    if (pointsPositive.length > 0 || pointsNegative.length > 0) {
      clustererPositive.load(pointsPositive);
      clustererNegative.load(pointsNegative);
      setPointsLoaded(true);
    }
  }, [pointsPositive, pointsNegative, clustererPositive, clustererNegative]);

  // Calcular zoom level baseado na latitudeDelta
  const getZoomLevel = (latitudeDelta: number): number => {
    if (latitudeDelta <= 0) return 0;
    const angle = Math.max(latitudeDelta, 0.0001);
    const zoom = Math.round(Math.log(360 / angle) / Math.LN2);
    return Math.max(0, Math.min(18, zoom));
  };

  // Obter clusters de ambos os tipos
  const clusters = useMemo(() => {
    if (!pointsLoaded) {
      return [];
    }

    try {
      const zoom = getZoomLevel(region.latitudeDelta);
      const bounds = [
        region.longitude - region.longitudeDelta, // west
        region.latitude - region.latitudeDelta, // south
        region.longitude + region.longitudeDelta, // east
        region.latitude + region.latitudeDelta, // north
      ] as [number, number, number, number];

      // Validar bounds
      if (
        !isFinite(bounds[0]) ||
        !isFinite(bounds[1]) ||
        !isFinite(bounds[2]) ||
        !isFinite(bounds[3])
      ) {
        return [];
      }

      // Obter clusters de ambos os tipos
      const clustersPositive = clustererPositive.getClusters(bounds, zoom);
      const clustersNegative = clustererNegative.getClusters(bounds, zoom);

      // Se zoom <= 8, criar um único cluster combinado
      // Clusters separados (positivos e negativos) só existem a partir de zoom 9
      if (zoom <= 8) {
        // Coletar todas as coordenadas dos clusters para verificar distâncias
        const allClusterCoords: [number, number][] = [];

        clustersPositive.forEach((cluster) => {
          const coords = cluster.geometry.coordinates;
          allClusterCoords.push([coords[0], coords[1]]);
        });

        clustersNegative.forEach((cluster) => {
          const coords = cluster.geometry.coordinates;
          allClusterCoords.push([coords[0], coords[1]]);
        });

        // Verificar se os clusters estão muito distantes
        // Se estiverem muito distantes, não combinar - manter separados
        let maxDistance = 0;
        if (allClusterCoords.length > 1) {
          for (let i = 0; i < allClusterCoords.length; i++) {
            for (let j = i + 1; j < allClusterCoords.length; j++) {
              const latDiff = Math.abs(allClusterCoords[i][1] - allClusterCoords[j][1]);
              const lngDiff = Math.abs(allClusterCoords[i][0] - allClusterCoords[j][0]);
              // Usar distância euclidiana simples
              const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
              maxDistance = Math.max(maxDistance, distance);
            }
          }
        }

        // Se a distância máxima entre clusters for maior que 5 graus (~550km), não combinar
        // Isso evita juntar clusters de continentes diferentes (ex: Brasil e USA)
        if (maxDistance > 10) {
          // Clusters muito distantes, retornar separados mesmo em zoom baixo
          const withType = clustersPositive.map((cluster) => ({
            ...cluster,
            properties: {
              ...cluster.properties,
              clusterType: 'positive' as const,
            },
          }));

          const withoutType = clustersNegative.map((cluster) => ({
            ...cluster,
            properties: {
              ...cluster.properties,
              clusterType: 'negative' as const,
            },
          }));

          return [...withType, ...withoutType];
        }

        // Clusters próximos, pode combinar
        // Calcular totais e centro médio
        let totalPositive = 0;
        let totalNegative = 0;
        let sumLat = 0;
        let sumLng = 0;
        let pointCount = 0;

        // Contar pontos em clusters positivos e calcular centro
        clustersPositive.forEach((cluster) => {
          const coords = cluster.geometry.coordinates;
          if (cluster.properties.cluster) {
            const count = cluster.properties.point_count || 0;
            totalPositive += count;
            sumLat += coords[1] * count;
            sumLng += coords[0] * count;
            pointCount += count;
          } else {
            totalPositive += 1;
            sumLat += coords[1];
            sumLng += coords[0];
            pointCount += 1;
          }
        });

        // Contar pontos em clusters negativos e calcular centro
        clustersNegative.forEach((cluster) => {
          const coords = cluster.geometry.coordinates;
          if (cluster.properties.cluster) {
            const count = cluster.properties.point_count || 0;
            totalNegative += count;
            sumLat += coords[1] * count;
            sumLng += coords[0] * count;
            pointCount += count;
          } else {
            totalNegative += 1;
            sumLat += coords[1];
            sumLng += coords[0];
            pointCount += 1;
          }
        });

        const totalPoints = totalPositive + totalNegative;

        // Se houver pontos, criar um cluster único no centro médio dos pontos reais
        if (totalPoints > 0 && pointCount > 0) {
          const centerLat = sumLat / pointCount;
          const centerLng = sumLng / pointCount;

          const combinedCluster = {
            type: 'Feature' as const,
            properties: {
              cluster: true,
              cluster_id: 999999, // ID especial para cluster combinado
              point_count: totalPoints,
              clusterType: 'combined' as const,
              positive: totalPositive,
              negative: totalNegative,
            },
            geometry: {
              type: 'Point' as const,
              coordinates: [centerLng, centerLat] as [number, number],
            },
          };

          return [combinedCluster];
        }

        return [];
      }

      // A partir de zoom 9, criar clusters separados por tipo
      const withType = clustersPositive.map((cluster) => ({
        ...cluster,
        properties: {
          ...cluster.properties,
          clusterType: 'positive' as const,
        },
      }));

      const withoutType = clustersNegative.map((cluster) => ({
        ...cluster,
        properties: {
          ...cluster.properties,
          clusterType: 'negative' as const,
        },
      }));

      // Combinar clusters
      const allClusters = [...withType, ...withoutType];

      // Retornar clusters sem offsets para evitar que se movam ao navegar pelo mapa
      // O Supercluster já gerencia a agregação de pontos próximos naturalmente
      return allClusters;
    } catch (error) {
      console.error('Erro ao obter clusters:', error);
      return [];
    }
  }, [region, clustererPositive, clustererNegative, pointsLoaded]);

  // Função para obter cor do cluster baseado no tipo
  const getClusterColor = (clusterType?: 'positive' | 'negative' | 'combined'): string => {
    if (clusterType === 'combined') {
      return '#348eac'; // Azul para cluster combinado
    }
    if (clusterType === 'positive') {
      return '#2E97BE'; // Azul para sentimento positivo
    }
    if (clusterType === 'negative') {
      return '#dd821a'; // Laranja para sentimento negativo
    }
    return '#348eac'; // Cor padrão
  };

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
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        region={region}
        onMapReady={handleMapReady}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="standard"
        provider="google"
      >
        {/* {clusters.map((point: ClusterFeature<any> | PointFeature<any>) => {
          const isCluster = 'cluster' in point.properties && point.properties.cluster === true;
          const coords = point.geometry.coordinates;
          const properties = point.properties;
          const clusterType = (properties as any).clusterType;

          return (
            <Marker
              key={isCluster 
                ? `cluster-${clusterType}-${(properties as any).cluster_id}` 
                : `marker-${properties.id}`
              }
              coordinate={{
                latitude: coords[1],
                longitude: coords[0],
              }}
              title={isCluster 
                ? clusterType === 'combined'
                  ? `Total: ${(properties as any).point_count}`
                  : `Cluster ${clusterType === 'positive' ? 'BEM' : 'MAL'} (${(properties as any).point_count})`
                : undefined
              }
              description={
                isCluster
                  ? clusterType === 'combined'
                    ? `😊: ${(properties as any).positive || 0} 😟: ${(properties as any).negative || 0}`
                    : `Clique para expandir`
                  : `Tipo: ${properties.reportType === 'POSITIVE' ? 'BEM' : 'MAL'}`
              }
              pinColor={!isCluster ? getClusterColor(clusterType) : undefined}
            >
              {isCluster && (
                <View
                  style={{
                    backgroundColor: getClusterColor(clusterType),
                    width: 40,
                    height: 40,
                    borderRadius: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 3,
                    borderColor: '#fff',
                    padding: 2,
                  }}
                >
                  <Text 
                    style={{ 
                      color: '#fff', 
                      fontWeight: 'bold', 
                      fontSize: 14,
                      textAlign: 'center',
                      includeFontPadding: false,
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.7}
                  >
                    {(properties as any).point_count}
                  </Text>
                </View>
              )}
            </Marker>
          );
        })} */}
        {points.length && <Heatmap
          points={(points || []).map(item => ({ latitude: item.latitude, longitude: item.longitude, weight: item.reportType == "POSITIVE" ? 1 : 0 }))}
          radius={50}
          opacity={0.8}
          gradient={{
            colors: ["rgba(255,0,0,1)"], // verde → vermelho
            startPoints: [1],
            colorMapSize: 256,
          }}
        />}

        {points.length && <Heatmap
          points={(points || []).map(item => ({ latitude: item.latitude, longitude: item.longitude, weight: item.reportType == "NEGATIVE" ? 1 : 0 }))}
          radius={50}
          opacity={0.8}
          gradient={{
            colors: ["rgba(0, 255, 47, 1)"], // verde → vermelho
            startPoints: [1],
            colorMapSize: 256,
          }}
        />}

      </MapView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2E97BE" />
        </View>
      )}

      <View style={[styles.cardContainer, { paddingBottom: Math.max(insets.bottom, 16) + bottomOffset}]}>
        <View style={[styles.card, !isCompliant && { opacity: 0.5 }]}>
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
    borderRadius: 25,
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
    borderRadius: 15,
    marginHorizontal: 4,
  },
  goodButton: {
    backgroundColor: colors.botãoBem,
  },
  badButton: {
    backgroundColor: colors.botãoMal,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

