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

// for browser use http backend to load translations and browser lng detector
if (i18n && process && !process.release) {
  i18n.use(Backend).use(LanguageDetector).use(initReactI18next);
}

// initialize if not already initialized
if (i18n && !i18n.isInitialized) {
  i18n.init(options);
  // check & set lang for user(logged) or host prefences
  Tracker.autorun(async () => {
    if (Meteor.isClient) {
      if (Meteor.userId()) {
        const handler = Meteor.subscribe('me');
        if (handler.ready()) {
          const userLang = Meteor.user()?.lang;
          i18n.changeLanguage(userLang);
        }
        return;
      }
    }
    try {
      const respond = await Meteor.callAsync('getCurrentHost');
      const hostLang = respond?.settings?.lang;
      i18n.changeLanguage(hostLang);
    } catch (error) {
      console.error(error);
    }
  });
}

export default i18n;
export { allLangs, defaultLang };
