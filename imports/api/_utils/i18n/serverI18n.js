import { Meteor } from 'meteor/meteor';
import cookie from 'cookie';

import i18n, { allLangs, defaultLang } from '../../../startup/i18n';

const SUPPORTED_LANGS = allLangs.map((l) => l.value);
const COOKIE_NAME = 'i18next'; // i18next-browser-languagedetector's default

function normalizeLang(candidate) {
  if (!candidate) {
    return null;
  }
  // 'languageOnly' load strategy (imports/startup/i18n.js) — 'sv-SE' -> 'sv'.
  const short = String(candidate).split('-')[0].toLowerCase();
  return SUPPORTED_LANGS.includes(short) ? short : null;
}

// First match wins from an Accept-Language header's comma-separated,
// quality-weighted list — good enough without pulling in a parser package,
// since we only ever pick from three supported languages.
function pickFromAcceptLanguage(header) {
  if (!header) {
    return null;
  }
  const candidates = header.split(',').map((part) => part.split(';')[0].trim());
  for (const candidate of candidates) {
    const match = normalizeLang(candidate);
    if (match) {
      return match;
    }
  }
  return null;
}

// Mirrors the client LanguageDetector's own priority order exactly
// (imports/startup/i18n.js's `detection.order`: querystring, cookie,
// localStorage, navigator) as closely as a server request allows —
// localStorage isn't visible to the server, so it's skipped; navigator's
// server-side equivalent is the Accept-Language header.
function resolveLang({ lngParam, cookieHeader, acceptLanguageHeader }) {
  const fromQuery = normalizeLang(lngParam);
  if (fromQuery) {
    return fromQuery;
  }

  const cookies = cookie.parse(cookieHeader || '');
  const fromCookie = normalizeLang(cookies[COOKIE_NAME]);
  if (fromCookie) {
    return fromCookie;
  }

  const fromHeader = pickFromAcceptLanguage(acceptLanguageHeader);
  if (fromHeader) {
    return fromHeader;
  }

  return defaultLang;
}

// For a plain HTTP request (oauth.js's connect-middleware handlers,
// serverRenderer.js). Callers extract their own lngParam since req shapes
// differ (a raw URL string vs. an already-parsed sink.request.url).
function resolveLangFromRequest(req, lngParam) {
  return resolveLang({
    lngParam,
    cookieHeader: req?.headers?.cookie,
    acceptLanguageHeader: req?.headers?.['accept-language'],
  });
}

// For a Meteor method call context (`this` inside Meteor.methods({...})).
// Prefers the calling user's stored profile language over request-level
// signals, since it's an explicit, durable preference rather than a guess.
async function resolveServerLang(methodContext) {
  if (methodContext?.userId) {
    const user = await Meteor.users.findOneAsync(methodContext.userId, {
      fields: { lang: 1 },
    });
    const fromProfile = normalizeLang(user?.lang);
    if (fromProfile) {
      return fromProfile;
    }
  }

  const headers = methodContext?.connection?.httpHeaders || {};
  return resolveLang({
    lngParam: undefined, // no querystring available on a DDP connection
    cookieHeader: headers.cookie,
    acceptLanguageHeader: headers['accept-language'],
  });
}

function translate(key, options, lang) {
  return i18n.t(key, { ...options, lng: lang || defaultLang });
}

export { translate, resolveServerLang, resolveLangFromRequest, resolveLang };
