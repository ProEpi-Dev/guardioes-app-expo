import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {
  MaintenanceInfo,
  getMaintenance,
  maintenanceFromResponse,
  setMaintenance,
  subscribeMaintenance,
} from '../services/maintenanceStore';

/**
 * Tempo máximo esperando o health check. Sem isso a Promise fica pendurada
 * indefinidamente em rede ruim e o app trava no splash.
 */
const HEALTH_TIMEOUT_MS = 8000;

/** Enquanto houver indisponibilidade, reconsulta para o app voltar sozinho. */
const RECHECK_INTERVAL_MS = 30000;

export function useConnection() {
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [maintenance, setMaintenanceState] = useState<MaintenanceInfo | null>(
    getMaintenance()
  );

  /**
   * Classifica pelo status da resposta, e não pela mera existência dela: um
   * 503 é resposta HTTP válida e seria lido como "API no ar" se o critério
   * fosse só `error.response`.
   */
  const checkHealth = useCallback(async () => {
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      return;
    }

    try {
      await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/v1/health`, {
        timeout: HEALTH_TIMEOUT_MS,
      });
      setMaintenance(null);
      return;
    } catch (error) {
      setMaintenance(maintenanceFromHealthError(error));
    }
  }, []);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    const unsubscribeStore = subscribeMaintenance(setMaintenanceState);

    return () => {
      unsubscribeNetInfo();
      unsubscribeStore();
    };
  }, []);

  useEffect(() => {
    let active = true;

    checkHealth().finally(() => {
      if (active) {
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [checkHealth]);

  // Sem isto o usuário fica preso na tela de manutenção mesmo depois que a
  // janela termina, e só sai reiniciando o app.
  useEffect(() => {
    if (!maintenance) {
      return;
    }

    const interval = setInterval(checkHealth, RECHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [maintenance, checkHealth]);

  // Voltar do background é o momento mais provável de a janela já ter passado.
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'active') {
          checkHealth();
        }
      }
    );

    return () => subscription.remove();
  }, [checkHealth]);

  return {
    loading,
    isOffline,
    maintenance,
    /** Só `full` bloqueia a navegação; os outros modos apenas informam. */
    isMaintenance: maintenance?.mode === 'full',
    recheck: checkHealth,
  };
}

function maintenanceFromHealthError(error: unknown): MaintenanceInfo | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const status = error.response?.status;

  if (status === 503) {
    return maintenanceFromResponse(status, error.response?.data);
  }

  // Sem resposta: servidor inalcançável ou timeout. É indisponibilidade de
  // fato, mas não anunciada — não há mensagem do backend para exibir.
  if (!error.response) {
    return {
      mode: 'full',
      title: '',
      message: '',
      startsAt: null,
      endsAt: null,
      fromApi: false,
    };
  }

  // Qualquer outra resposta significa que a API respondeu. Um 500 pontual é
  // problema da rota, não motivo para bloquear o app inteiro.
  return null;
}
