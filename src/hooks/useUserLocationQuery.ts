import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import type { LocationObject } from 'expo-location';

export const USER_LOCATION_QUERY_KEY = ['userLocation'] as const;

async function fetchUserLocation(): Promise<LocationObject | null> {
  try {
    const { status: current } = await Location.getForegroundPermissionsAsync();
    let status = current;

    if (current !== 'granted') {
      const res = await Promise.race([
        Location.requestForegroundPermissionsAsync(),
        new Promise<never>((_, rej) =>
          setTimeout(() => rej(new Error('timeout')), 15000)
        ),
      ]);
      status = res.status;
    }

    if (status !== 'granted') return null;

    // 1. Tenta pegar a localização da memória cache do celular (MUITO RÁPIDO)
    const lastKnownLocation = await Location.getLastKnownPositionAsync();
    if (lastKnownLocation) {
      return lastKnownLocation;
    }

    // 2. Se não tiver nada no cache, aí sim força a busca no GPS, mas aceitando uma precisão mais baixa para ser mais rápido
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low, // Mudado de Balanced para Low para evitar travamentos
      mayShowUserSettingsDialog: true,
    });
  } catch (error) {
    console.warn('Erro ao capturar localização:', error);
    return null;
  }
}

export function useUserLocationQuery() {
  const query = useQuery({
    queryKey: USER_LOCATION_QUERY_KEY,
    queryFn: fetchUserLocation,
    staleTime: 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 min (antes era cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    location: query.data ?? null,
    isLoading: query.isPending,
    isSuccess: query.isSuccess && query.data != null,
    isError: query.isError,
    refetch: query.refetch,
    ...query,
  };
}
