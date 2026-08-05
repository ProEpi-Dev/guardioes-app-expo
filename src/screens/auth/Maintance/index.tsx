import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { colors } from '../../../utils/colors';
import { GradientBackground } from '../../../components/SnowForms';

import { styles, Logo } from './styles';

const GDSLogoBR = require('../../../../assets/logo_gds_completa_branca.png');

export function Maintance() {
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

        <Text style={styles.text}>
          Olá Guardiões, informamos que o aplicativo está em manutenção.
        </Text>
        <Text style={styles.text}>
          Avisaremos pelas notificações e email quando as atividades voltarem ao
          normal.
        </Text>
      </View>
    </GradientBackground>
  );
}
