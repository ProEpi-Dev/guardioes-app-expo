/**
 * Expo app config with environment-based variables.
 * - Local: load .env and use APP_ENV or NODE_ENV.
 * - EAS Build: use EAS_BUILD_PROFILE (production, preview, development) and EAS Secrets / eas.json env.
 */

try {
  require('dotenv').config();
} catch {
  // dotenv not installed; rely on process.env from EAS or shell
}

const _IS_EAS = !!process.env.EAS_BUILD;

// Resolve current environment
function getEnvironment() {
  if (process.env.EAS_BUILD_PROFILE) {
    return process.env.EAS_BUILD_PROFILE;
  }
  return process.env.APP_ENV || process.env.NODE_ENV || 'development';
}

const environment = getEnvironment();

// Environment-specific overrides (add more as needed)
const envConfig = {
  development: {},
  preview: {},
  production: {},
};

const overrides = envConfig[environment] || envConfig.development;

module.exports = ({ config }) => {
  const googleMapsApiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    (config?.ios?.config?.googleMapsApiKey ?? '');

  return {
    expo: {
      name: 'Guardiões da Saúde',
      slug: 'guardioes-expo',
      version: '4.3.2',
      orientation: 'portrait',
      icon: './assets/514x514_ícone_gs.jpg',
      userInterfaceStyle: 'light',
      newArchEnabled: true,
      // EAS Update: a partir desta build, correções que não tocam código nativo
      // chegam na próxima abertura do app, sem passar pelas lojas.
      updates: {
        url: 'https://u.expo.dev/80b44ef1-f17e-4e58-a13b-f140c23d6e3a',
        // 0 = não segura o splash esperando update; aplica no próximo boot.
        fallbackToCacheTimeout: 0,
      },
      // Amarra o update à versão do app: uma build 4.2.11 só recebe updates
      // publicados para 4.2.11, o que impede JS novo rodar sobre nativo antigo.
      runtimeVersion: {
        policy: 'appVersion',
      },
      splash: {
        image: './assets/logo_gds_completa_branca.png',
        resizeMode: 'contain',
        backgroundColor: '#2E97BE',
      },
      ios: {
        googleServicesFile: './GoogleService-Info.plist',
        supportsTablet: true,
        bundleIdentifier: 'com.guardioesapp',
        ...(googleMapsApiKey && {
          config: {
            googleMapsApiKey,
          },
        }),
        infoPlist: {
          NSLocationWhenInUseUsageDescription:
            'Precisamos da sua localização para mostrar sua posição no mapa.',
          ITSAppUsesNonExemptEncryption: false,
          UIBackgroundModes: ['remote-notification', 'fetch'],
        },
      },
      android: {
        googleServicesFile: './google-services.json',
        adaptiveIcon: {
          foregroundImage: './assets/1024x1024_ícone_gs.jpg',
          backgroundColor: '#ffffff',
        },
        package: 'com.guardioesapp',
        edgeToEdgeEnabled: true,
        permissions: ['android.permission.POST_NOTIFICATIONS'],
      },
      web: {
        favicon: './assets/1024x1024_ícone_gs.jpg',
      },
      plugins: [
        'expo-localization',
        '@react-native-firebase/app',
        '@react-native-firebase/messaging',
        './plugins/withIosFirebasePodfile.js',
        './plugins/withGoogleMapsApiKey.js',
        './plugins/withAndroidLocalProperties.js',
      ],
      extra: {
        eas: {
          projectId: '80b44ef1-f17e-4e58-a13b-f140c23d6e3a',
        },
        environment,
        ...overrides,
      },
    },
  };
};
