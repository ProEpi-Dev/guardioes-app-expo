import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScreenLoader from './src/components/ScreenLoader';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ParticipationProvider } from './src/contexts/ParticipationContext';
import { Maintance } from './src/screens/auth/Maintance';
import {
  Platform,
  PermissionsAndroid,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  getMessaging,
  getToken,
  getAPNSToken,
  requestPermission,
  registerDeviceForRemoteMessages,
  onMessage,
  onTokenRefresh,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import {
  getRemoteConfig,
  setConfigSettings,
  setDefaults,
  fetchAndActivate,
  getValue,
} from '@react-native-firebase/remote-config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

const messaging = getMessaging();

/**
 * iOS: FCM getToken fails until APNs device token is set (async after registerForRemoteMessages).
 */
async function waitForApnsDeviceToken(timeoutMs = 45000, intervalMs = 250) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const apns = await getAPNSToken(messaging);
      if (apns && typeof apns === 'string' && apns.length > 0) {
        return apns;
      }
    } catch {
      // Still registering; keep polling.
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return null;
}

setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  if (__DEV__) {
    console.log(
      '[FCM] background handler:',
      remoteMessage?.messageId,
      remoteMessage?.data
    );
  }
});

// Referência para navegação
export const navigationRef = React.createRef();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
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
        await Notifications.setNotificationChannelAsync(
          'high_importance_channel',
          {
            name: 'Notificações Urgentes',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound: 'default',
            enableVibrate: true,
            lockscreenVisibility:
              Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: true,
          }
        );
      }
      if (Platform.OS === 'ios') {
        await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
      }

      const authStatus = await requestPermission(messaging);
      // 1 = AUTHORIZED, 2 = PROVISIONAL, 3 = EPHEMERAL (iOS 14+)
      const enabled = authStatus === 1 || authStatus === 2 || authStatus === 3;

      if (!enabled && __DEV__) {
        console.warn(
          '[FCM] notification permission not granted. authStatus=',
          authStatus,
          '( -1 not determined, 0 denied )'
        );
      }

      if (enabled) {
        try {
          // iOS: expo-notifications needs its own permission for local banners (foreground).
          if (Platform.OS === 'ios') {
            const perm = await Notifications.getPermissionsAsync();
            if (perm.status !== 'granted') {
              await Notifications.requestPermissionsAsync();
            }
          }

          // iOS: register with APNs, then wait for device token before getToken (Firebase 10.4+).
          let iosApnsReady = Platform.OS !== 'ios';
          if (Platform.OS === 'ios') {
            await registerDeviceForRemoteMessages(messaging);
            const apns = await waitForApnsDeviceToken();
            iosApnsReady = !!(apns && apns.length > 0);
            if (__DEV__) {
              if (iosApnsReady) {
                console.log('[FCM] APNs device token received');
              } else {
                console.warn(
                  '[FCM] No APNs token within timeout. Simulator often never receives one; use a physical iPhone, or check Push capability + signing.'
                );
              }
            }
          }

          let token = null;
          if (iosApnsReady || Platform.OS === 'android') {
            token = await getToken(messaging);
            if (!token && Platform.OS === 'ios') {
              for (let i = 0; i < 20 && !token; i += 1) {
                await new Promise((r) => setTimeout(r, 500));
                token = await getToken(messaging);
              }
            }
          }

          if (__DEV__) {
            if (token && typeof token === 'string' && token.length > 0) {
              console.log('[FCM] device token (FCM):', token);
            } else {
              let apnsHint = null;
              if (Platform.OS === 'ios') {
                try {
                  apnsHint = await getAPNSToken(messaging);
                } catch {
                  apnsHint = null;
                }
              }
              console.warn(
                '[FCM] getToken returned empty. iOS APNs token present:',
                !!apnsHint,
                '| Configure APNs key in Firebase Console (Project settings → Cloud Messaging).'
              );
            }
          }
        } catch (error) {
          if (__DEV__) {
            console.warn(
              '[FCM] getToken failed:',
              error?.message || error,
              error?.code
            );
          }
        }
      }

      const unsubscribeTokenRefresh = onTokenRefresh(messaging, (newToken) => {
        if (__DEV__ && newToken) {
          console.log('[FCM] token refreshed:', newToken);
        }
      });

      const unsubscribe = onMessage(messaging, async (remoteMessage) => {
        if (__DEV__) {
          console.log(
            '[FCM] foreground message:',
            JSON.stringify(remoteMessage)
          );
        }

        const { notification, data } = remoteMessage;
        const payload = data && typeof data === 'object' ? data : {};

        // Data-only messages have no `notification` — iOS would show nothing in foreground without this.
        const title =
          notification?.title ??
          payload.title ??
          payload.notification_title ??
          'Guardiões da Saúde';
        const body =
          notification?.body ??
          payload.body ??
          payload.message ??
          payload.notification_body ??
          '';

        const shouldShow =
          !!notification ||
          (typeof body === 'string' && body.length > 0) ||
          (typeof payload.body === 'string' && payload.body.length > 0);

        if (shouldShow) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: String(title),
              body: String(body || 'Nova notificação'),
              data: payload,
              ...(Platform.OS === 'android' && {
                android: {
                  channelId: 'high_importance_channel',
                  importance: Notifications.AndroidImportance.MAX,
                },
              }),
            },
            trigger: Platform.OS === 'ios' ? { seconds: 1 } : null,
          });
        }
      });

      return () => {
        unsubscribeTokenRefresh();
        unsubscribe();
      };
    };

    let cleanupNotifications;
    setupNotifications().then((cleanup) => {
      cleanupNotifications = cleanup;
    });

    return () => {
      if (cleanupNotifications) cleanupNotifications();
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
          routes: [{ name: 'Login' }],
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
  const [loading, setLoading] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const setupRemoteConfig = async () => {
      try {
        // 1. Obtém a instância principal do Remote Config
        const rc = getRemoteConfig();

        // 2. Zera o cache APENAS em desenvolvimento
        if (__DEV__) {
          // Em desenvolvimento: busca os dados na hora (sem cache)
          await setConfigSettings(rc, {
            minimumFetchIntervalMillis: 0,
          });
        } else {
          // Em produção: define um intervalo seguro para o cache
          await setConfigSettings(rc, {
            minimumFetchIntervalMillis: 600000, // 10 minutos | 1 minuto = 60000ms
          });
        }

        // 3. Define um valor padrão local de segurança
        await setDefaults(rc, {
          manutencao: false,
        });

        // 4. Busca e ativa as configurações no Firebase
        await fetchAndActivate(rc);

        // 5. Lê o valor do parâmetro passando a instância e a chave
        const maintenanceMode = getValue(rc, 'manutencao').asBoolean();

        setIsMaintenance(maintenanceMode);
      } catch (error) {
        console.error('Erro ao buscar o Remote Config:', error);
      } finally {
        setLoading(false);
      }
    };

    setupRemoteConfig();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Renderiza a tela de manutenção se a flag for verdadeira
  if (isMaintenance) {
    return <Maintance />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ParticipationProvider>
          <NavigationContainer ref={navigationRef}>
            <AppContent />
          </NavigationContainer>
        </ParticipationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
});
