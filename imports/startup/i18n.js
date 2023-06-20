import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import yaml from 'js-yaml';

const defaultLang = 'en';
const allLangs = [defaultLang, 'sv', 'tr'];
const namespaces = [
  'common',
  'accounts',
  'members',
  'hosts',
  'admin',
  'activities',
  'processes',
  'calendar',
  'resources',
];

const options = {
  allowMultiLoading: true,
  backend: {
    loadPath: '/i18n/{{lng}}/{{ns}}.yml',
    parse: function (data) {
      return yaml.load(data);
    },
  },
  debug: false,
  defaultNS: 'common',
  fallbackLng: allLangs,
  lng: defaultLang,
  load: 'languageOnly',
  ns: namespaces,
  only: '*',
  preload: allLangs,
  saveMissing: true,
  supportedLngs: allLangs,
  useSuspense: process && !process.release,
};

// for browser use http backend to load translations and browser lng detector
if (process && !process.release) {
  i18n.use(Backend).use(initReactI18next).use(LanguageDetector);
}

// initialize if not already initialized
if (!i18n.isInitialized) {
  i18n.init(options);
  // check & set lang for user(logged) or host prefences
  Tracker.autorun(() => {
    let preferedLang = defaultLang;
    if (Meteor.userId()) {
      const handler = Meteor.subscribe('me');
      if (handler.ready()) {
        preferedLang = Meteor.user()?.lang;
      }
    } else {
      Meteor.call('getCurrentHost', (error, respond) => {
        if (respond) {
          preferedLang = respond?.settings?.lang;
        }
      });
    }
    i18n.changeLanguage(preferedLang);
  });
}

export default i18n;
export { defaultLang };
