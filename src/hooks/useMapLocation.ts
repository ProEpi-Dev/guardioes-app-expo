import { useState, useRef, useEffect, RefObject } from 'react';
import MapView, { Region } from 'react-native-maps';
import type { LocationObject } from 'expo-location';

const DEFAULT_REGION: Region = {
  latitude: -15.8194724,
  longitude: -47.924146,
  latitudeDelta: 1.0,
  longitudeDelta: 1.0,
};

export const useMapLocation = (
  mapRef: RefObject<MapView | null>,
  userLocation?: LocationObject | null,
  isMapReady: boolean = false
) => {
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const hasCenteredOnUser = useRef(false);

  useEffect(() => {
    if (hasCenteredOnUser.current || !userLocation?.coords || !isMapReady)
      return;

    const { latitude, longitude } = userLocation.coords;
    const userRegion: Region = {
      latitude,
      longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  }, [userLocation, isMapReady]);

  return { region, setRegion };
};
