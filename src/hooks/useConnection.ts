import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {
  MaintenanceInfo,
  MaintenanceMode,
  getMaintenance,
  maintenanceFromResponse,
  setMaintenance,
  subscribeMaintenance,
} from '../services/maintenanceStore';

/**
 * Tempo máximo esperando a consulta de status. Sem isso a Promise fica
 * pendurada indefinidamente em rede ruim e o app trava no splash.
 */
const STATUS_TIMEOUT_MS = 8000;

/** Enquanto houver indisponibilidade, reconsulta para o app voltar sozinho. */
const RECHECK_INTERVAL_MS = 30000;

/** Sem previsão de retorno anunciada — usado quando o servidor não responde. */
const UNANNOUNCED_OUTAGE: MaintenanceInfo = {
  mode: 'full',
  title: '',
  message: '',
  startsAt: null,
  endsAt: null,
  fromApi: false,
};

type MaintenanceStatusResponse = {
  inMaintenance?: boolean;
  mode?: MaintenanceMode;
  title?: string;
  message?: string;
  startsAt?: string | null;
  endsAt?: string | null;
};

export function useConnection() {
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [maintenance, setMaintenanceState] = useState<MaintenanceInfo | null>(
    getMaintenance()
  );

  /**
   * Consulta o estado da janela na fonte de verdade.
   *
   * Não serve usar /v1/health aqui: ele fica liberado durante a manutenção,
   * então responderia 200 no meio de uma janela e o app limparia o estado que
   * o interceptor tinha acabado de publicar. Além disso, o modo `banner` não
   * faz requisição nenhuma falhar — este endpoint é o único jeito de descobri-lo.
   */
  const checkStatus = useCallback(async () => {
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      return;
    }

    try {
      const { data } = await axios.get<MaintenanceStatusResponse>(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/v1/maintenance/current`,
        { timeout: STATUS_TIMEOUT_MS }
      );
      setMaintenance(fromStatusResponse(data));
    } catch (error) {
      setMaintenance(maintenanceFromStatusError(error));
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

    checkStatus().finally(() => {
      if (active) {
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [checkStatus]);

  // Sem isto o usuário fica preso na tela de manutenção mesmo depois que a
  // janela termina, e só sai reiniciando o app.
  useEffect(() => {
    if (!maintenance) {
      return;
    }

    const interval = setInterval(checkStatus, RECHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [maintenance, checkStatus]);

  // Voltar do background é o momento mais provável de a janela já ter passado.
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'active') {
          checkStatus();
        }
      }
    );

    return () => subscription.remove();
  }, [checkStatus]);

  return {
    loading,
    isOffline,
    maintenance,
    /** Só `full` bloqueia a navegação; os outros modos apenas informam. */
    isMaintenance: maintenance?.mode === 'full',
    recheck: checkStatus,
  };
}

function fromStatusResponse(
  data: MaintenanceStatusResponse | undefined
): MaintenanceInfo | null {
  if (!data?.inMaintenance || !data.mode) {
    return null;
  }

  return {
    mode: data.mode,
    title: data.title ?? '',
    message: data.message ?? '',
    startsAt: data.startsAt ?? null,
    endsAt: data.endsAt ?? null,
    fromApi: true,
  };
}

function maintenanceFromStatusError(error: unknown): MaintenanceInfo | null {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  if (error.response?.status === 503) {
    return maintenanceFromResponse(503, error.response.data);
  }

  // Sem resposta: servidor inalcançável ou timeout. É indisponibilidade de
  // fato, mas não anunciada — não há mensagem do backend para exibir.
  if (!error.response) {
    return UNANNOUNCED_OUTAGE;
  }

  // Qualquer outra resposta significa que a API respondeu. Cobre também o app
  // atualizar antes do backend: num 404 deste endpoint, o certo é não bloquear
  // nada e deixar o interceptor tratar os 503 que aparecerem.
  return null;
}
