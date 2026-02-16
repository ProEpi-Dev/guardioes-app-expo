/**
 * Expo plugin to inject Google Maps API Key from .env file into AndroidManifest.xml
 * The key is read from: process.env.GOOGLE_MAPS_API_KEY (.env file)
 * 
 * This plugin runs during 'expo prebuild' and automatically injects
 * the key from .env into the generated AndroidManifest.xml.
 */

const fs = require('fs');
const path = require('path');

/**
 * Reads the .env file and returns an object with the variables
 */
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};

  envContent.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    // Ignore comments and empty lines
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        // Remove quotes if present
        envVars[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
  });

  return envVars;
}

let withAndroidManifest;

try {
  // Try to import from @expo/config-plugins (available in Expo SDK)
  withAndroidManifest = require('@expo/config-plugins').withAndroidManifest;
} catch (e) {
  // Fallback: try from expo directly
  try {
    withAndroidManifest = require('expo/config-plugins').withAndroidManifest;
  } catch (e2) {
    console.warn('⚠️  @expo/config-plugins not found. The plugin may not work correctly.');
    // Return empty function if unable to import
    module.exports = (config) => config;
  }
}

if (withAndroidManifest) {
  const withGoogleMapsApiKey = (config) => {
    return withAndroidManifest(config, async (config) => {
      const androidManifest = config.modResults;
      
      // Load variables from .env
      const envVars = loadEnvFile();
      
      // Try to get the key from .env or environment variables
      const apiKey = process.env.GOOGLE_MAPS_API_KEY || envVars.GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error('❌ Google Maps API Key not found!');
        console.error('   Make sure the .env file exists in the project root');
        console.error('   and contains: GOOGLE_MAPS_API_KEY=your_key_here');
        console.error('   Or set the GOOGLE_MAPS_API_KEY environment variable');
        throw new Error('GOOGLE_MAPS_API_KEY not found. Check the .env file');
      }

      // Find the <application> tag
      const application = androidManifest.manifest.application?.[0];

      if (!application) {
        console.warn('⚠️  <application> tag not found in AndroidManifest');
        return config;
      }

      // Check if meta-data already exists
      const existingMetaData = application['meta-data'] || [];
      const googleMapsMetaDataIndex = existingMetaData.findIndex(
        (meta) => meta.$ && meta.$['android:name'] === 'com.google.android.geo.API_KEY'
      );

      const metaData = {
        $: {
          'android:name': 'com.google.android.geo.API_KEY',
          'android:value': apiKey,
        },
      };

      if (googleMapsMetaDataIndex >= 0) {
        // Update existing meta-data
        existingMetaData[googleMapsMetaDataIndex] = metaData;
        // console.log('✅ Google Maps API Key updated in AndroidManifest (from .env)');
      } else {
        // Add new meta-data
        if (!application['meta-data']) {
          application['meta-data'] = [];
        }
        application['meta-data'].push(metaData);
        // console.log('✅ Google Maps API Key added to AndroidManifest (from .env)');
      }

      return config;
    });
  };

  module.exports = withGoogleMapsApiKey;
}

