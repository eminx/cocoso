import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/sv';
import 'dayjs/locale/tr';
import updateLocale from 'dayjs/plugin/updateLocale';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { Box } from '/imports/ui/core';
import useMediaQuery from '/imports/api/_utils/useMediaQuery';
import { applyGlobalStyles } from '/imports/ui/utils/globalStylesManager';
import { call } from '/imports/api/_utils/shared';

import Header from './ui/layout/Header';
import HelmetHybrid from './ui/layout/HelmetHybrid';
import { Footer, PlatformFooter } from './ui/layout/Footers';
import TopBarHandler from './ui/layout/TopBarHandler';
import DummyWrapper from './ui/layout/DummyWrapper';
import { message } from './ui/generic/message';

export const platformAtom = atom(null);
export const currentUserAtom = atom(null);
export const currentHostAtom = atom(null);
export const allHostsAtom = atom([]);
export const pageTitlesAtom = atom([]);
export const roleAtom = atom(null);
export const canCreateContentAtom = atom((get) => {
  const role = get(roleAtom);
  return role && ['admin', 'contributor'].includes(role);
});
export const isDesktopAtom = atom(true);
export const isMobileAtom = atom(false);
export const renderedAtom = atom(false);

dayjs.extend(updateLocale);

export default function LayoutContainer({
  initialCurrentHost,
  initialPageTitles,
  initialPlatform,
  children,
}) {
  const currentUser = useTracker(() => Meteor.user(), []);
  const setPlatform = useSetAtom(platformAtom);
  const [currentHost, setCurrentHost] = useAtom(currentHostAtom);
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setAllHosts = useSetAtom(allHostsAtom);
  const setPageTitles = useSetAtom(pageTitlesAtom);
  const setRole = useSetAtom(roleAtom);
  const [rendered, setRendered] = useAtom(renderedAtom);
  const [isDesktop, setIsDesktop] = useAtom(isDesktopAtom);
  const setIsMobile = useSetAtom(isMobileAtom);
  const [, i18n] = useTranslation();
  const isDesktopValue = useMediaQuery('(min-width: 960px)');
  const isMobileValue = useMediaQuery('(max-width: 480px)');

  const [tc] = useTranslation('common');

  useLayoutEffect(() => {
    setCurrentUser(currentUser);
    setCurrentHost(initialCurrentHost || window?.__PRELOADED_STATE__?.Host);
    setPageTitles(initialPageTitles);
    setPlatform(initialPlatform);
    setIsDesktop(isDesktopValue);
    setIsMobile(isMobileValue);
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  useLayoutEffect(() => {
    if (!currentHost || !currentHost.theme) {
      return;
    }
    applyGlobalStyles(currentHost.theme);
  }, [currentHost]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    const hostWithinUser = currentUser?.memberships?.find(
      (membership) => membership?.host === window.location.host
    );
    setRole(hostWithinUser?.role || null);
  }, [currentUser]);

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

  const getAllHosts = async () => {
    try {
      const respond = await call('getAllHosts');
      setAllHosts(respond.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllHosts();
  }, []);

  const pathname = window?.location?.pathname;
  const pathnameSplitted = pathname.split('/');
  const isLogoSmall =
    pathnameSplitted &&
    !['pages', 'info', 'cp'].includes(pathnameSplitted[1]) &&
    Boolean(pathnameSplitted[2]);
  const adminPage = pathnameSplitted[1] === 'admin';

  useEffect(() => {
    if (pathnameSplitted[1][0] === '@' && !pathnameSplitted[3]) {
      return;
    }
    window.scrollTo(0, 0);
  }, [pathnameSplitted[2]]);

  return (
    <>
      <HelmetHybrid Host={currentHost} />

      <DummyWrapper animate={rendered && !isDesktop} theme={currentHost?.theme}>
        {rendered && !adminPage && <TopBarHandler slideStart={rendered} />}
        {!adminPage && (
          <Header
            Host={currentHost}
            isLogoSmall={isEntryPage}
            pageTitles={pageTitles}
          />
        )}
        {children}
      </DummyWrapper>

      {!adminPage && (
        <>
          <Footer />
          <PlatformFooter />
        </>
      )}

      {rendered && (
        <Toaster containerStyle={{ minWidth: '120px', zIndex: 999999 }} />
      )}
    </>
  );
}
