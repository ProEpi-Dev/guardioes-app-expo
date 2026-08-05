import { I18n } from 'i18n-js';
// import * as Localization from 'expo-localization';

import en from './en';
import pt from './pt';
import es from './es';

const i18n = new I18n();

i18n.fallbacks = true;
i18n.missingBehavior = 'guess';
i18n.defaultLocale = 'en';

i18n.translations = {
  en,
  pt,
  es,
};

// const deviceLanguage = Localization.getLocales()[0]?.languageCode;
// console.log(deviceLanguage);
// i18n.locale = deviceLanguage || 'en';
i18n.locale = 'pt';

export const setLocale = (locale) => {
  i18n.locale = locale;
};

export const getCurrentLocale = () => i18n.locale;

export const translateHeaderText =
  (langKey) =>
  ({ screenProps }) => {
    const title = i18n.translate(langKey, screenProps.language);
    return { title };
  };

export default i18n.translate.bind(i18n);
