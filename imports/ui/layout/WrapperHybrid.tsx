import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { useHydrateAtoms } from 'jotai/utils';
import { useAtom, useSetAtom } from 'jotai';
import { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/sv';
import 'dayjs/locale/tr';
import updateLocale from 'dayjs/plugin/updateLocale';

import useMediaQuery from '/imports/api/_utils/useMediaQuery';
import Memberships from '/imports/api/memberships/membership';
import i18n from '/imports/startup/i18n';
import {
  allHostsAtom,
  currentHostAtom,
  currentUserAtom,
  pageTitlesAtom,
  platformAtom,
  roleAtom,
  isDesktopAtom,
  isMobileAtom,
  renderedAtom,
} from '/imports/state';
import { applyGlobalStyles } from '/imports/ui/utils/globalStylesManager';
import { restoreKeyFromSession } from '/imports/utils/setupEncryption';
import { call } from '/imports/api/_utils/shared';
import { Box, Loader } from '/imports/ui/core';

import HelmetHybrid from './HelmetHybrid';
import DummyWrapper from './DummyWrapper';
import TopBarHandler from './TopBarHandler';
import Header from './Header';
import { Footer, PlatformFooter } from './Footers';

dayjs.extend(updateLocale);

export interface WrapperHybridProps {
  Host: any;
  allHosts: any[];
  pageTitles: any[];
  platform: any;
  // Set only by serverRenderer.js — a per-request i18next clone
  // (i18n.cloneInstance) already resolved to the visitor's actual
  // language, so SSR output matches what the client will hydrate with.
  // Never set client-side; falls back to the shared singleton below.
  i18nInstance?: any;
}

export default function WrapperHybrid({
  Host,
  allHosts,
  pageTitles,
  platform,
  i18nInstance,
}: WrapperHybridProps) {
  useHydrateAtoms([[platformAtom, platform]]);
  useHydrateAtoms([[allHostsAtom, allHosts]]);
  const [currentHost, setCurrentHost] = useAtom(currentHostAtom);
  const [pTitles, setPageTitles] = useAtom(pageTitlesAtom);
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setRole = useSetAtom(roleAtom);
  const [rendered, setRendered] = useAtom(renderedAtom);

  const isDesktopValue = useMediaQuery('(min-width: 960px)');
  const isMobileValue = useMediaQuery('(max-width: 480px)');
  const setIsDesktop = useSetAtom(isDesktopAtom);
  const setIsMobile = useSetAtom(isMobileAtom);
  const location = useLocation();

  useSubscribe('currentUser');
  useSubscribe('myMemberships');
  const currentUser = useTracker(() => {
    if (Meteor.isClient) {
      const user = Meteor.users.findOne(Meteor.userId());
      if (!user) {
        return null;
      }
      // memberships no longer live on the user doc; reattach from the
      // client-side Memberships minimongo collection (see myMemberships pub)
      const memberships = Memberships.find({ userId: user._id }).fetch();
      return { ...user, memberships };
    }
    return null;
  }, []);

  const setValues = async () => {
    setCurrentHost(await call('getCurrentHost'));
    setPageTitles(await call('getPageTitles'));
  };

  const changeLang = () => {
    if (!i18n) return;
    const userLang = currentUser?.lang;
    const hostLang = currentHost?.settings?.lang;
    const lang = userLang || hostLang || i18n.language;

    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  };

  useEffect(() => {
    setValues();
    restoreKeyFromSession();
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  useEffect(() => {
    setIsDesktop(isDesktopValue);
    setIsMobile(isMobileValue);
  }, [isDesktopValue, isMobileValue]);

  useEffect(() => {
    if (!currentHost) return;
    applyGlobalStyles(currentHost.theme);
    // Only apply host language if no user preference has been detected/stored yet.
    // User language is applied in the currentUser effect with higher priority.
    if (!currentUser) {
      const hostLang = currentHost?.settings?.lang;
      if (hostLang && hostLang !== i18n.language) {
        i18n.changeLanguage(hostLang);
      }
    }
  }, [currentHost]);

  useEffect(() => {
    if (!i18n || !i18n.language) {
      return;
    }
    let culture = 'en-GB';
    if (i18n.language !== 'en') {
      culture = i18n.language;
    }
    dayjs.updateLocale(culture, {
      weekStart: 1,
    });
  }, [i18n?.language]);

  useEffect(() => {
    if (!currentUser) return;
    setCurrentUser(currentUser);
    const hostWithinUser = currentUser?.memberships?.find(
      (membership: any) => membership?.host === window.location.host
    );
    setRole(hostWithinUser?.role || null);
    changeLang();
  }, [currentUser]);

  const pathname = location?.pathname;
  const pathnameSplitted = pathname.split('/');
  const adminPage = ['admin', 'superadmin'].includes(pathnameSplitted[1]);

  useEffect(() => {
    if (pathnameSplitted[1][0] === '@' && !pathnameSplitted[3]) {
      return;
    }
    window.scrollTo(0, 0);
  }, [pathnameSplitted[2]]);

  return (
    <>
      <HelmetHybrid Host={currentHost || Host} />

      <I18nextProvider i18n={i18nInstance || i18n}>
        <Suspense fallback={<Loader />}>
          <DummyWrapper
            animate={rendered && !isDesktopValue}
            theme={currentHost?.theme || Host?.theme}
          >
            {rendered && !adminPage && <TopBarHandler slideStart={rendered} />}
            {!adminPage && (
              <Header
                currentHost={currentHost || Host}
                pageTitles={pTitles || pageTitles}
              />
            )}

            <Box id="main-content-container">
              <Outlet />
            </Box>

            {!adminPage && (
              <>
                <Footer currentHost={currentHost || Host} />
                <PlatformFooter />
              </>
            )}
          </DummyWrapper>
        </Suspense>

        {rendered && (
          <Toaster containerStyle={{ minWidth: '120px', zIndex: 999999 }} />
        )}
      </I18nextProvider>
    </>
  );
}
