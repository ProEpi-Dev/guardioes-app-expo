import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ScreenLoader from './src/components/ScreenLoader';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Componente interno que usa o AuthContext
function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <ScreenLoader />;
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
