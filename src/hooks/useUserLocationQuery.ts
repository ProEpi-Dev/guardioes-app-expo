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
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      mayShowUserSettingsDialog: true,
    });
  } catch {
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
