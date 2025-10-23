import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ScreenLoader from './src/components/ScreenLoader';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ScreenLoader />;
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
