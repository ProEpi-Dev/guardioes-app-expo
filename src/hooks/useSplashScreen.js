import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import authStorage from '../services/authStorage';

export const useSplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();

        // Simulate loading time (like the original app)
        await authStorage.getToken();
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the splash screen
        await SplashScreen.hideAsync();
        setIsLoading(false);
      }
    };

    prepare();
  }, []);

  return { isLoading };
};
