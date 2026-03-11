
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: [
      'translation',
      'components/SuggestSeasonalGuidelines',
    ],
    defaultNS: 'translation',
    interpolation: { escapeValue: false },
    backend: {
      loadPath: '/src/i18n/{{ns}}.{{lng}}.json',
    },
  });

export default i18n;
