import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useAuth } from '../contexts/AuthContext';
import { useParticipation } from '../contexts/ParticipationContext';
import { countPending, subscribeQueue } from '../services/offlineReportQueue';
import { flushQueue } from '../services/reportSync';

const RETRY_INTERVAL_MS = 60 * 1000;

/**
 * Envia os reports guardados offline. Gatilhos:
 *  - login / abertura do app com sessão (participationId disponível)
 *  - volta da conexão (NetInfo)
 *  - app volta do background
 *  - a cada minuto enquanto houver pendentes
 * Os registros feitos na tela já disparam o envio no próprio fluxo.
 */
export function useOfflineSync() {
  const { isAuthenticated } = useAuth();
  const { participationId } = useParticipation();
  const [pendingCount, setPendingCount] = useState(0);
  const wasOffline = useRef(false);

  const canSync = isAuthenticated && !!participationId;

  const refreshCount = useCallback(async () => {
    if (!participationId) {
      setPendingCount(0);
      return;
    }
    try {
      setPendingCount(await countPending(participationId));
    } catch {}
  }, [participationId]);

  const sync = useCallback(async () => {
    if (!canSync || !participationId) return;
    try {
      await flushQueue(participationId);
    } catch (error) {
      console.warn('[useOfflineSync] falha ao sincronizar', error);
    } finally {
      refreshCount();
    }
  }, [canSync, participationId, refreshCount]);

  useEffect(() => {
    refreshCount();
    return subscribeQueue(() => {
      refreshCount();
    });
  }, [refreshCount]);

  // Ao entrar / trocar de participação
  useEffect(() => {
    sync();
  }, [sync]);

  // Volta da conexão
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline =
        state.isConnected === false || state.isInternetReachable === false;
      if (wasOffline.current && !offline) {
        sync();
      }
      wasOffline.current = offline;
    });
    return unsubscribe;
  }, [sync]);

  // App volta do background
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'active') sync();
      }
    );
    return () => subscription.remove();
  }, [sync]);

  // Retentativa periódica enquanto houver pendentes
  useEffect(() => {
    if (!canSync || pendingCount === 0) return;
    const interval = setInterval(sync, RETRY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [canSync, pendingCount, sync]);

  return { pendingCount, sync };
}
