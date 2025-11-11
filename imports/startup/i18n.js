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

// const Backend = Meteor.isClient ? I18NextHttpBackend : I18NexFsBackend;
const Backend = I18NextHttpBackend;

const options = {
  backend: {
    loadPath,
    parse: (data) => yaml.load(data),
  },
  debug: false,
  defaultNS: 'common',
  detection: {
    order: [
      'querystring',
      'cookie',
      'localStorage',
      'navigator',
      'htmlTag',
      'path',
      'subdomain',
    ], // Specify the order of language detection
    caches: ['cookie'], // Cache the selected language
  },
  fallbackLng: defaultLang,
  interpolation: {
    escapeValue: false,
  },
  lng: defaultLang,
  load: 'languageOnly',
  ns: ['common'],
  only: '*',
  preload: ['en'],
  react: {
    useSuspense: true,
  },
  saveMissing: true,
  supportedLngs: allLangs.map((l) => l.value),
  useSuspense: process && !process.release,
};

if (i18n && process && !process.release) {
  i18n.use(Backend).use(LanguageDetector).use(initReactI18next);
}
if (i18n && !i18n.isInitialized) {
  i18n.init(options);
  Tracker.autorun(async () => {
    if (Meteor.isServer) {
      return;
    }

    try {
      const userLang = await Meteor.callAsync('getCurrentUserLang');
      const host = await Meteor.callAsync('getCurrentHost');
      const hostLang = host?.lang;
      const lang = userLang || hostLang || defaultLang;
      if (lang === i18n.language) {
        return;
      }
      i18n.changeLanguage(lang);
    } catch (error) {
      console.error(error);
    }
  });
}

export default i18n;
export { allLangs, defaultLang };
