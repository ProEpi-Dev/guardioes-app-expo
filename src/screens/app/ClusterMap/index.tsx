import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import type { Region } from 'react-native-maps';
import Supercluster from 'supercluster';
import type { ClusterFeature, PointFeature } from 'supercluster';
import type { MarkerData } from './types';

const generateBrasiliaMarkers = (count: number = 100): MarkerData[] => {
  // Coordenadas de Brasília
  const centerLat = -15.8194724;
  const centerLng = -47.924146;
  
  // Área ao redor de Brasília - não muito espalhada
  const latDelta = 0.5; // Área de ~0.5 graus ao redor de Brasília
  const lngDelta = 0.5;
  
  // Área muito pequena para criar clusters bem concentrados
  const clusterLatDelta = 0.001; // Marcadores extremamente próximos dentro do cluster
  const clusterLngDelta = 0.001;
  
  // Número de clusters a criar - menos clusters, mais marcadores por cluster
  const numClusters = Math.floor(count / 12); // ~25 clusters para 300 marcadores
  const markersPerCluster = Math.floor(count / numClusters);
  
  const markers: MarkerData[] = [];
  
  // Criar clusters muito concentrados na região de Brasília
  for (let i = 0; i < numClusters; i++) {
    // Cada cluster em uma área próxima a Brasília
    const clusterCenterLat = centerLat + (Math.random() - 0.5) * latDelta;
    const clusterCenterLng = centerLng + (Math.random() - 0.5) * lngDelta;
    
    // Criar muitos marcadores muito próximos neste cluster
    for (let j = 0; j < markersPerCluster && markers.length < count; j++) {
      markers.push({
        latitude: clusterCenterLat + (Math.random() - 0.5) * clusterLatDelta,
        longitude: clusterCenterLng + (Math.random() - 0.5) * clusterLngDelta,
        symptom: Math.random() > 0.5 ? ['Febre'] : [],
        id: `marker-${markers.length}`,
      });
    }
  }
  
  // Adicionar marcadores restantes em áreas concentradas também
  while (markers.length < count) {
    // Criar alguns clusters adicionais menores na região de Brasília
    const randomLat = centerLat + (Math.random() - 0.5) * latDelta;
    const randomLng = centerLng + (Math.random() - 0.5) * lngDelta;
    
    // Adicionar 2-3 marcadores próximos neste ponto
    const additionalMarkers = Math.min(3, count - markers.length);
    for (let k = 0; k < additionalMarkers && markers.length < count; k++) {
      markers.push({
        latitude: randomLat + (Math.random() - 0.5) * clusterLatDelta,
        longitude: randomLng + (Math.random() - 0.5) * clusterLngDelta,
        symptom: Math.random() > 0.5 ? ['Febre'] : [],
        id: `marker-${markers.length}`,
      });
    }
  }
  
  return markers;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export function ClusterMap() {
  const [markersData] = useState<MarkerData[]>(() => {
    const generated = generateBrasiliaMarkers(500);
    console.log('Total de marcadores gerados:', generated.length);
    return generated;
  });

  const [region, setRegion] = useState<Region>({
    // Brasília como centro
    latitude: -15.8194724,
    longitude: -47.924146,
    // Região inicial mostrando área ao redor de Brasília
    latitudeDelta: 1.0,
    longitudeDelta: 1.0,
  });

  // Separar pontos por tipo (com sintomas e sem sintomas)
  const { pointsWithSymptoms, pointsWithoutSymptoms } = useMemo(() => {
    const withSymptoms: any[] = [];
    const withoutSymptoms: any[] = [];

    markersData.forEach((marker) => {
      const point = {
        type: 'Feature' as const,
        properties: {
          id: marker.id,
          symptom: marker.symptom,
          hasSymptoms: marker.symptom.length > 0,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [marker.longitude, marker.latitude] as [number, number],
        },
      };

      if (marker.symptom.length > 0) {
        withSymptoms.push(point);
      } else {
        withoutSymptoms.push(point);
      }
    });

    return { pointsWithSymptoms: withSymptoms, pointsWithoutSymptoms: withoutSymptoms };
  }, [markersData]);

  // Criar duas instâncias do Supercluster - uma para cada tipo
  const clustererWithSymptoms = useRef(
    new Supercluster({
      radius: 80,
      minZoom: 5,
      maxZoom: 15,
      minPoints: 2,
    })
  ).current;

  const clustererWithoutSymptoms = useRef(
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
    if (pointsWithSymptoms.length > 0 || pointsWithoutSymptoms.length > 0) {
      clustererWithSymptoms.load(pointsWithSymptoms);
      clustererWithoutSymptoms.load(pointsWithoutSymptoms);
      setPointsLoaded(true);
    }
  }, [pointsWithSymptoms, pointsWithoutSymptoms, clustererWithSymptoms, clustererWithoutSymptoms]);

  // Calcular zoom level baseado na latitudeDelta
  const getZoomLevel = (latitudeDelta: number): number => {
    if (latitudeDelta <= 0) return 0;
    const angle = Math.max(latitudeDelta, 0.0001); // Evitar valores muito pequenos
    const zoom = Math.round(Math.log(360 / angle) / Math.LN2);
    // Garantir que o zoom está dentro do range válido
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
      const clustersWithSymptoms = clustererWithSymptoms.getClusters(bounds, zoom);
      const clustersWithoutSymptoms = clustererWithoutSymptoms.getClusters(bounds, zoom);

      // Se zoom <= 8, criar um único cluster combinado
      // Clusters separados (com sintomas e sem sintomas) só existem a partir de zoom 9
      if (zoom <= 8) {
        // Calcular totais
        let totalWithSymptoms = 0;
        let totalWithoutSymptoms = 0;

        // Contar pontos em clusters com sintomas
        clustersWithSymptoms.forEach((cluster) => {
          if (cluster.properties.cluster) {
            totalWithSymptoms += cluster.properties.point_count || 0;
          } else {
            totalWithSymptoms += 1;
          }
        });

        // Contar pontos em clusters sem sintomas
        clustersWithoutSymptoms.forEach((cluster) => {
          if (cluster.properties.cluster) {
            totalWithoutSymptoms += cluster.properties.point_count || 0;
          } else {
            totalWithoutSymptoms += 1;
          }
        });

        const totalPoints = totalWithSymptoms + totalWithoutSymptoms;

        // Se houver pontos, criar um cluster único no centro da região visível
        if (totalPoints > 0) {
          const combinedCluster = {
            type: 'Feature' as const,
            properties: {
              cluster: true,
              cluster_id: 999999, // ID especial para cluster combinado
              point_count: totalPoints,
              clusterType: 'combined' as const,
              withSymptoms: totalWithSymptoms,
              withoutSymptoms: totalWithoutSymptoms,
            },
            geometry: {
              type: 'Point' as const,
              coordinates: [region.longitude, region.latitude] as [number, number],
            },
          };

          return [combinedCluster];
        }

        return [];
      }

      // A partir de zoom 9, criar clusters separados por tipo
      // Adicionar propriedade para identificar o tipo
      const withType = clustersWithSymptoms.map((cluster) => ({
        ...cluster,
        properties: {
          ...cluster.properties,
          clusterType: 'withSymptoms' as const,
        },
      }));

      const withoutType = clustersWithoutSymptoms.map((cluster) => ({
        ...cluster,
        properties: {
          ...cluster.properties,
          clusterType: 'withoutSymptoms' as const,
        },
      }));

      // Combinar clusters
      const allClusters = [...withType, ...withoutType];

      // Determinar se estamos em um zoom muito afastado (vista ampla do estado)
      // latitudeDelta > 3.0 significa que estamos vendo uma área muito grande
      const isWideView = region.latitudeDelta > 3.0;

      // Aplicar offsets para evitar sobreposição de clusters próximos
      // Mas apenas quando não estivermos em vista ampla (onde clusters devem se combinar naturalmente)
      const clustersWithOffsets = allClusters.map((cluster, index) => {
        const coords = cluster.geometry.coordinates;
        const clusterType = (cluster.properties as any).clusterType;
        let totalOffsetLat = 0;
        let totalOffsetLng = 0;
        let nearbyCount = 0;

        // Se estivermos em vista ampla, não aplicar offsets - deixar clusters se combinarem naturalmente
        if (isWideView) {
          return cluster;
        }

        // Verificar todos os clusters próximos e calcular offset acumulado
        for (let i = 0; i < allClusters.length; i++) {
          if (i === index) continue;

          const otherCoords = allClusters[i].geometry.coordinates;
          const latDiff = coords[1] - otherCoords[1];
          const lngDiff = coords[0] - otherCoords[0];
          const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

          // Se estiverem muito próximos (menos de 0.00015 graus, aproximadamente 16 metros)
          const threshold = 0.00015;
          if (distance < threshold) {
            nearbyCount++;
            const otherType = (allClusters[i].properties as any).clusterType;

            // Calcular direção de repulsão
            const angle = Math.atan2(latDiff, lngDiff);
            const offsetAmount = clusterType !== otherType ? 0.0002 : 0.00012; // Offset maior para tipos diferentes
            
            // Adicionar offset na direção oposta ao cluster próximo
            totalOffsetLng += Math.cos(angle + Math.PI) * offsetAmount;
            totalOffsetLat += Math.sin(angle + Math.PI) * offsetAmount;
          }
        }

        // Se houver clusters próximos, aplicar offset
        if (nearbyCount > 0) {
          // Normalizar o offset se houver muitos clusters próximos
          const normalization = Math.min(1.5, 1 + nearbyCount * 0.1);
          totalOffsetLng *= normalization;
          totalOffsetLat *= normalization;
        }

        // Retornar cluster com coordenadas ajustadas
        return {
          ...cluster,
          geometry: {
            ...cluster.geometry,
            coordinates: [
              coords[0] + totalOffsetLng,
              coords[1] + totalOffsetLat,
            ] as [number, number],
          },
        };
      });

      return clustersWithOffsets;
    } catch (error) {
      console.error('Erro ao obter clusters:', error);
      return [];
    }
  }, [region, clustererWithSymptoms, clustererWithoutSymptoms, pointsLoaded]);

  const handleClusterPress = (cluster: ClusterFeature<any> | PointFeature<any>, clusterType?: 'withSymptoms' | 'withoutSymptoms' | 'combined') => {
    // Apenas logar o clique, sem dar zoom automático
    // O Callout já mostra as informações quando o usuário clica
    try {
      if ('cluster' in cluster.properties && cluster.properties.cluster) {
        console.log('Cluster pressionado:', clusterType, 'Total:', (cluster.properties as any).point_count);
      } else {
        console.log('Marcador pressionado:', cluster.properties);
      }
    } catch (error) {
      console.error('Erro ao processar clique no cluster:', error);
    }
  };

  // Função para obter cor do cluster baseado no tipo
  const getClusterColor = (clusterType?: 'withSymptoms' | 'withoutSymptoms' | 'combined', hasSymptoms?: boolean) => {
    if (clusterType === 'combined') {
      return '#348eac'; // Azul para cluster combinado
    }
    if (clusterType === 'withSymptoms' || hasSymptoms) {
      return '#e74c3c'; // Vermelho para sintomas
    }
    if (clusterType === 'withoutSymptoms' || !hasSymptoms) {
      return '#27ae60'; // Verde para sem sintomas
    }
    return '#348eac'; // Cor padrão
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
      >
        {clusters.map((point: ClusterFeature<any> | PointFeature<any>) => {
          const isCluster = 'cluster' in point.properties && point.properties.cluster === true;
          const coords = point.geometry.coordinates;
          const properties = point.properties;
          const clusterType = (properties as any).clusterType;
          const hasSymptoms = (properties as any).hasSymptoms;

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
              onPress={() => handleClusterPress(point, clusterType)}
              title={isCluster 
                ? clusterType === 'combined'
                  ? `Total: ${(properties as any).point_count}`
                  : `Cluster ${clusterType === 'withSymptoms' ? 'Sintomas' : 'Sem Sintomas'} (${(properties as any).point_count})`
                : `Marcador ${properties.id}`
              }
              description={
                isCluster
                  ? clusterType === 'combined'
                    ? `🔴: ${(properties as any).withSymptoms || 0}🟢: ${(properties as any).withoutSymptoms || 0}`
                    : `Clique para expandir`
                  : (properties.symptom as string[])?.length > 0
                  ? `Sintomas: ${(properties.symptom as string[]).join(', ')}`
                  : 'Sem sintomas'
              }
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
        })}
      </MapView>
    </View>
  );
}


