import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { useHydrateAtoms } from 'jotai/utils';
import { useAtom, useSetAtom } from 'jotai';
import { useHydrated } from 'react-hydration-provider';
import { Toaster } from 'react-hot-toast';

import useMediaQuery from '/imports/api/_utils/useMediaQuery';
import i18n from '/imports/startup/i18n';
import {
  // allHostsAtom,
  currentHostAtom,
  currentUserAtom,
  pageTitlesAtom,
  platformAtom,
  roleAtom,
  // isDesktopAtom,
  // isMobileAtom,
  renderedAtom,
} from '/imports/state';

import HelmetHybrid from './HelmetHybrid';
import DummyWrapper from './DummyWrapper';
import TopBarHandler from './TopBarHandler';
import Header from './Header';
import { Footer, PlatformFooter } from './Footers';

export default function WrapperHybrid({ Host, pageTitles, platform }) {
  useHydrateAtoms([
    [currentHostAtom, Host],
    [pageTitlesAtom, pageTitles],
    [platformAtom, platform],
  ]);

  console.log('Wrapper Host:', Host);
  const [currentHost, setCurrentHost] = useAtom(currentHostAtom);
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setRole = useSetAtom(roleAtom);
  const [rendered, setRendered] = useAtom(renderedAtom);
  const location = useLocation();
  const hydrated = useHydrated();

  const setHost = async () => {
    setCurrentHost(await call('getCurrentHost'));
  };

  useEffect(() => {
    setHost();
    const currentUser = Meteor.user();
    setCurrentUser(currentUser);
    const hostWithinUser = currentUser?.memberships?.find(
      (membership) => membership?.host === window.location.host
    );
    setRole(hostWithinUser?.role || null);
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  const pathname = location?.pathname;
  const pathnameSplitted = pathname.split('/');
  const adminPage = pathnameSplitted[1] === 'admin';

  // const isDesktopValue = useMediaQuery('(min-width: 960px)');
  // const isMobileValue = useMediaQuery('(max-width: 480px)');
  // const setAllHosts = useSetAtom(allHostsAtom);
  // const setRole = useSetAtom(roleAtom);
  // const [isDesktop, setIsDesktop] = useAtom(isDesktopAtom);
  // const setIsMobile = useSetAtom(isMobileAtom);

  return (
    <>
      <HelmetHybrid Host={currentHost} />

      <I18nextProvider i18n={i18n}>
        <DummyWrapper>
          {rendered && !adminPage && <TopBarHandler />}
          {!adminPage && <Header />}

          <Outlet />

          <Footer />
          <PlatformFooter />
        </DummyWrapper>

        {rendered && (
          <Toaster containerStyle={{ minWidth: '120px', zIndex: 999999 }} />
        )}
      </I18nextProvider>
    </>
  );
}
