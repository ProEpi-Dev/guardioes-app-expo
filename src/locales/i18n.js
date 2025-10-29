import { I18n } from 'i18n-js'; // 1. Importa de 'i18n-js'
import * as Localization from 'expo-localization'; // 2. Importa o expo-localization

// Importa suas traduções
import en from './en';
import pt from './pt';
import es from './es';

// Cria a instância do I18n
const i18n = new I18n();

// Configurações
i18n.fallbacks = true;
i18n.missingBehavior = 'guess';
i18n.defaultLocale = 'en';

// Define as traduções
i18n.translations = { 
    en,
    pt,
    es,
};


i18n.locale = Localization.getLocales()[0]?.locale || 'pt';



export const setLocale = (locale) => {
    i18n.locale = locale;
};

export const getCurrentLocale = () => i18n.locale;

export const translateHeaderText = (langKey) => ({ screenProps }) => {
    const title = i18n.translate(langKey, screenProps.language);
    return { title };
};


export default i18n.translate.bind(i18n);