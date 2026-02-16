import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ScreenLoader from './src/components/ScreenLoader';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ParticipationProvider } from './src/contexts/ParticipationContext';
import { Platform, PermissionsAndroid } from 'react-native';
import * as Notifications from 'expo-notifications'; 
import { 
  getMessaging, 
  getToken, 
  requestPermission, 
  onMessage, 
  setBackgroundMessageHandler
} from '@react-native-firebase/messaging';

const messaging = getMessaging();

setBackgroundMessageHandler(messaging, async remoteMessage => {
  // console.log('Mensagem em Background (App Fechado):', remoteMessage);
});


// Referência para navegação
export const navigationRef = React.createRef();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Componente interno que usa o AuthContext
function AppContent() {
  const { isLoading, isAuthenticated } = useAuth();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Aguardar o carregamento terminar antes de navegar
    const setupNotifications = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
        } catch (err) {
          console.warn('Erro permissão Android:', err);
        }
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('high_importance_channel', {
          name: 'Notificações Urgentes',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
          enableVibrate: true,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: true,
        });
      }

      const authStatus = await requestPermission(messaging);
      const enabled = authStatus === 1 || authStatus === 2;

      if (enabled) {
        try {
          const token = await getToken(messaging);
          // console.log('>>> TOKEN FCM (Modular):', token);
        } catch (error) {
          // console.log('Erro token FCM:', error);
        }
      }

      const unsubscribe = onMessage(messaging, async remoteMessage => {
        // console.log('Foreground FCM:', remoteMessage);
        
        const { notification, data } = remoteMessage;
        
        if (notification) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: notification.title,
              body: notification.body,
              data: data,
              android: {
                channelId: 'high_importance_channel',
                importance: Notifications.AndroidImportance.MAX,
              },
            },
            trigger: null,
          });
        }
      });

      return unsubscribe;
    };

    let unsubscribeOnMessage;
    setupNotifications().then(unsub => {
      unsubscribeOnMessage = unsub;
    });

    return () => {
      if (unsubscribeOnMessage) unsubscribeOnMessage();
    };
  }, []);

  useEffect(() => {
    // Aguardar o carregamento terminar antes de navegar
    if (!isLoading && navigationRef.current && !hasNavigated.current) {
      hasNavigated.current = true;
      
      if (isAuthenticated) {
        // Se estiver autenticado, navegar para Home
        // console.log('🔐 [App] Usuário autenticado, navegando para Home');
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        // Se não estiver autenticado, garantir que está na Welcome
        // console.log('🔐 [App] Usuário não autenticado, mantendo na Welcome');
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
      <ParticipationProvider>
        <NavigationContainer ref={navigationRef}>
          <AppContent />
        </NavigationContainer>
      </ParticipationProvider>
    </AuthProvider>
  );
}
