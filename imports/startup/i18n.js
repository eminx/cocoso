import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import yaml from 'js-yaml';

import Hosts from '../api/hosts/host';

const defaultLang = 'en';
const allLangs = [defaultLang, 'sv'];
const options = {
  lng: defaultLang,
  fallbackLng: allLangs,
  supportedLngs: allLangs,
  preload: [defaultLang],
  load: 'languageOnly', // we only provide en, de -> no region specific locals like en-US, de-DE
  // have a common namespace used around the full app
  ns: [
    'common',
    'accounts',
    'members',
    'hosts',
    'admin',
    'activities',
    'processes',
    'calendar',
    'resources',
  ],
  defaultNS: 'common',
  // saveMissing: true,
  // debug: true,
  backend: {
    loadPath: '/i18n/{{lng}}/{{ns}}.yml',
    parse(data) {
      return yaml.load(data);
    },
  },
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
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
      const handler = Meteor.subscribe('currentHost');
      if (handler.ready()) {
        preferedLang = Hosts.findOne().settings.lang;
      }
    }
    i18n.changeLanguage(preferedLang);
  });
}

export default i18n;
export { defaultLang };
