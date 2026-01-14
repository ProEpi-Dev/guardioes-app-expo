import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export function useUserLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const refreshLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;

      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(current);
      return current;
    } catch (error) {
      console.log('Erro localização', error);
      return null;
    }
  };

  useEffect(() => { refreshLocation(); }, []);

  return { location, refreshLocation };
}