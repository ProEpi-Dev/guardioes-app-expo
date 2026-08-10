import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import dayjs from 'dayjs';
import { colors } from '../../../utils/colors';
import { GradientBackground } from '../../../components/SnowForms';
import { MaintenanceInfo } from '../../../services/maintenanceStore';

import { styles, Logo } from './styles';

const GDSLogoBR = require('../../../../assets/logo_gds_completa_branca.png');

interface MaintanceProps {
  /** Ausente ou sem `fromApi` quando o backend não respondeu o payload. */
  maintenance?: MaintenanceInfo | null;
  onRetry?: () => void;
  retrying?: boolean;
}

/**
 * A mensagem vem resolvida do backend, já no idioma do dispositivo. O texto
 * fixo abaixo é o fallback para quando não há resposta da API — queda não
 * anunciada, ou 503 opaco de proxy.
 */
export function Maintance({ maintenance, onRetry, retrying }: MaintanceProps) {
  const hasServerText = Boolean(maintenance?.fromApi && maintenance.message);

  return (
    <GradientBackground
      colors={[colors.azulClaro, colors.gradientSocialLinkEscuro]}
    >
      <View style={styles.container}>
        <StatusBar
          backgroundColor={colors.gradientSocialLinkEscuro}
          barStyle="light-content"
        />

        <Logo source={GDSLogoBR} />

        {hasServerText ? (
          <>
            {maintenance?.title ? (
              <Text style={styles.title}>{maintenance.title}</Text>
            ) : null}
            <Text style={styles.text}>{maintenance?.message}</Text>
            {formatReturn(maintenance?.endsAt) ? (
              <Text style={styles.text}>
                {formatReturn(maintenance?.endsAt)}
              </Text>
            ) : null}
          </>
        ) : (
          <>
            <Text style={styles.text}>
              Olá Guardiões, informamos que o aplicativo está em manutenção.
            </Text>
            <Text style={styles.text}>
              Avisaremos pelas notificações e email quando as atividades
              voltarem ao normal.
            </Text>
          </>
        )}

        {onRetry ? (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            disabled={retrying}
            accessibilityRole="button"
            accessibilityLabel="Tentar novamente"
          >
            {retrying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.retryLabel}>Tentar novamente</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </GradientBackground>
  );
}

/** `endsAt` vem em UTC; o dayjs converte para o fuso do aparelho. */
function formatReturn(endsAt?: string | null): string | null {
  if (!endsAt) {
    return null;
  }

  const date = dayjs(endsAt);
  if (!date.isValid()) {
    return null;
  }

  return `Previsão de retorno: ${date.format('DD/MM [às] HH:mm')}`;
}
