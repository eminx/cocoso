import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { useHydrateAtoms } from 'jotai/utils';
import { useAtom, useSetAtom } from 'jotai';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/sv';
import 'dayjs/locale/tr';
import updateLocale from 'dayjs/plugin/updateLocale';

import useMediaQuery from '/imports/api/_utils/useMediaQuery';
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

import HelmetHybrid from './HelmetHybrid';
import DummyWrapper from './DummyWrapper';
import TopBarHandler from './TopBarHandler';
import Header from './Header';
import { Footer, PlatformFooter } from './Footers';
import { call } from '/imports/api/_utils/shared';

dayjs.extend(updateLocale);

export default function WrapperHybrid({
  Host,
  allHosts,
  pageTitles,
  platform,
}) {
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
  const currentUser = useTracker(() => {
    if (Meteor.isClient) {
      return Meteor.users.findOne(Meteor.userId());
    }
    return null;
  }, []);

  const setValues = async () => {
    setCurrentHost(await call('getCurrentHost'));
    setPageTitles(await call('getPageTitles'));
  };

  useEffect(() => {
    setIsDesktop(isDesktopValue);
    setIsMobile(isMobileValue);
    setValues();
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (currentHost) {
      applyGlobalStyles(currentHost.theme);
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
    setCurrentUser(currentUser);
    const hostWithinUser = currentUser?.memberships?.find(
      (membership) => membership?.host === window.location.host
    );
    setRole(hostWithinUser?.role || null);
  }, [currentUser]);

  const pathname = location?.pathname;
  const pathnameSplitted = pathname.split('/');
  const adminPage = pathnameSplitted[1] === 'admin';

  useEffect(() => {
    if (pathnameSplitted[1][0] === '@' && !pathnameSplitted[3]) {
      return;
    }
    window.scrollTo(0, 0);
  }, [pathnameSplitted[2]]);

  return (
    <>
      <HelmetHybrid Host={currentHost || Host} />

      <I18nextProvider i18n={i18n}>
        <DummyWrapper theme={currentHost?.theme || Host?.theme}>
          {rendered && !adminPage && <TopBarHandler />}
          {!adminPage && (
            <Header
              currentHost={currentHost || Host}
              pageTitles={pTitles || pageTitles}
            />
          )}

          <Outlet />

          <Footer currentHost={currentHost || Host} />
          <PlatformFooter />
        </DummyWrapper>

        {rendered && (
          <Toaster containerStyle={{ minWidth: '120px', zIndex: 999999 }} />
        )}
      </I18nextProvider>
    </>
  );
}
