import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ScreenLoader from './src/components/ScreenLoader';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Referência para navegação
export const navigationRef = React.createRef();

// Componente interno que usa o AuthContext
function AppContent() {
  const { isLoading, isAuthenticated } = useAuth();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Aguardar o carregamento terminar antes de navegar
    if (!isLoading && navigationRef.current && !hasNavigated.current) {
      hasNavigated.current = true;
      
      if (isAuthenticated) {
        // Se estiver autenticado, navegar para Home
        console.log('🔐 [App] Usuário autenticado, navegando para Home');
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        // Se não estiver autenticado, garantir que está na Welcome
        console.log('🔐 [App] Usuário não autenticado, mantendo na Welcome');
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <ScreenLoader />;
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
