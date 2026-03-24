/**
 * Expo config plugin: fix "GoogleUtilities does not define modules" for React Native Firebase on iOS.
 * Injects use_modular_headers! inside the app target so Firebase Swift pods can integrate.
 * (We do NOT use use_frameworks :linkage => :static, which breaks React Native headers.)
 */

const { withDangerousMod } = require('expo/config-plugins');
const path = require('path');
const fs = require('fs');

function withIosFirebasePodfile(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) return config;

      let contents = fs.readFileSync(podfilePath, 'utf8');

      if (contents.includes('use_modular_headers!')) {
        return config;
      }

      // Insert use_modular_headers! right after "target 'AppName' do"
      contents = contents.replace(
        /(target\s+['"][^'"]+['"]\s+do)\n/,
        "$1\n  use_modular_headers!\n"
      );
      fs.writeFileSync(podfilePath, contents);

      return config;
    },
  ]);
}

module.exports = withIosFirebasePodfile;
