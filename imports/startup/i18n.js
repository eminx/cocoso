import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import yaml from 'js-yaml';

const { cdnserver } = Meteor.settings;

const allLangs = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'sv',
    label: 'Svenska',
  },
  {
    value: 'tr',
    label: 'Türkçe',
  },
];

const defaultLang = 'en';

// const namespaces = [
//   'common',
//   'accounts',
//   'members',
//   'hosts',
//   'admin',
//   'activities',
//   'groups',
//   'calendar',
//   'resources',
// ];

const path = '/i18n/{{lng}}/{{ns}}.yml';
const loadPath = Meteor.isProduction && cdnserver ? cdnserver + path : path;

const isServer = Meteor.isServer;

const options = {
  backend: {
    loadPath,
    parse: (data) => yaml.load(data),
  },
  debug: !Meteor.isProduction,
  defaultNS: 'common',
  detection: isServer
    ? undefined // No browser language detection in SSR
    : {
        order: ['querystring', 'cookie', 'localStorage', 'navigator'],
        caches: ['cookie'],
      },
  fallbackLng: defaultLang,
  interpolation: {
    escapeValue: false,
  },
  lng: defaultLang,
  load: 'languageOnly',
  ns: ['common'],
  preload: ['en'],
  react: {
    useSuspense: false,
  },
  supportedLngs: allLangs.map((l) => l.value),
};

i18n
  .use(initReactI18next)
  .use(I18NextHttpBackend)
  .use(LanguageDetector)
  .init(options);

export default i18n;
export { allLangs, defaultLang };
