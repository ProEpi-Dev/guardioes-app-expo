import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

// Evita várias requisições simultâneas (ex.: quando o componente remonta várias vezes)
let requesting = false;

export function useUserLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const mounted = useRef(true);

  const refreshLocation = async () => {
    if (requesting) {
      console.log('[useUserLocation] já existe requisição em andamento, ignorando');
      return null;
    }
    requesting = true;
    console.log('[useUserLocation] verificando permissão...');
    try {
      // Verifica estado atual (resolve rápido); só pede se precisar
      const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
      console.log('[useUserLocation] permissão atual:', currentStatus);

      let status = currentStatus;
      if (currentStatus !== 'granted') {
        const TIMEOUT_MS = 15000;
        const permissionPromise = Location.requestForegroundPermissionsAsync();
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
        );
        try {
          const result = await Promise.race([permissionPromise, timeoutPromise]);
          status = result.status;
          console.log('[useUserLocation] status após pedir permissão:', status);
        } catch (e) {
          console.log('[useUserLocation] timeout ou erro ao aguardar permissão:', e);
          return null;
        }
      }
      if (status !== 'granted') {
        console.log('[useUserLocation] permissão negada:', status);
        return null;
      }
      console.log('[useUserLocation] permissão concedida, obtendo posição...');
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        mayShowUserSettingsDialog: true,
      });
      console.log('[useUserLocation] localização obtida', {
        lat: current.coords.latitude,
        lng: current.coords.longitude,
      });
      if (mounted.current) setLocation(current);
      return current;
    } catch (error) {
      console.log('[useUserLocation] erro', error);
      return null;
    } finally {
      requesting = false;
    }
  };

  useEffect(() => {
    mounted.current = true;
    refreshLocation();
    return () => {
      mounted.current = false;
    };
  }, []);

  return { location, refreshLocation };
}