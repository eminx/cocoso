import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { useHydrateAtoms } from 'jotai/utils';
import { useSetAtom } from 'jotai';

import useMediaQuery from '/imports/api/_utils/useMediaQuery';
import i18n from '/imports/startup/i18n';
import {
  allHostsAtom,
  currentHostAtom,
  currentUserAtom,
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

const isClient = Meteor.isClient;

export default function WrapperHybrid({
  currentUser,
  Host,
  isEntryPage = false,
  pageTitles,
  platform,
  children,
}) {
  useHydrateAtoms([
    [currentHostAtom, Host],
    [currentUserAtom, currentUser],
    [pageTitlesAtom, pageTitles],
    [platformAtom, platform],
  ]);
  const setRendered = useSetAtom(renderedAtom);
  const location = useLocation();

  useEffect(() => {
    // setRendered(false);
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

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
          <Header
            Host={Host}
            isLogoSmall={isEntryPage}
            pageTitles={pageTitles}
          />

          {children}
        </DummyWrapper>
      </I18nextProvider>
    </>
  );
}
