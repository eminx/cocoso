import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { useHydrateAtoms } from 'jotai/utils';
import { useAtom, useSetAtom } from 'jotai';
import { useHydrated } from 'react-hydration-provider';
import { Toaster } from 'react-hot-toast';

import TopBarHandler from '/imports/ui/layout/TopBarHandler';
import { Footer, PlatformFooter } from '/imports/ui/layout/Footers';
import useMediaQuery from '/imports/api/_utils/useMediaQuery';
import i18n from '/imports/startup/i18n';
import {
  allHostsAtom,
  currentHostAtom,
  pageTitlesAtom,
  platformAtom,
  roleAtom,
  canCreateContentAtom,
  isDesktopAtom,
  isMobileAtom,
  renderedAtom,
} from '/imports/state';

import Header from './Header';
import HelmetHybrid from './HelmetHybrid';
import DummyWrapper from './DummyWrapper';

export default function WrapperHybrid({
  currentUser,
  Host,
  pageTitles,
  platform,
}) {
  useHydrateAtoms([
    [currentHostAtom, Host],
    [pageTitlesAtom, pageTitles],
    [platformAtom, platform],
  ]);
  const [rendered, setRendered] = useAtom(renderedAtom);
  const location = useLocation();
  const hydrated = useHydrated();

  useEffect(() => {
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
      <HelmetHybrid Host={Host} />

      <I18nextProvider i18n={i18n}>
        <DummyWrapper theme={Host?.theme}>
          {rendered && !adminPage && <TopBarHandler />}
          {!adminPage && <Header Host={Host} pageTitles={pageTitles} />}

          <Outlet />

          <Footer currentHost={Host} />
          <PlatformFooter />
        </DummyWrapper>

        {hydrated && (
          <Toaster containerStyle={{ minWidth: '120px', zIndex: 999999 }} />
        )}
      </I18nextProvider>
    </>
  );
}
