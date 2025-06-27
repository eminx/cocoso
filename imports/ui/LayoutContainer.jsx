import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  ChakraProvider,
  ColorModeProvider,
  useMediaQuery,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/sv';
import 'dayjs/locale/tr';
import updateLocale from 'dayjs/plugin/updateLocale';

import { call } from './utils/shared';
import generateTheme from './utils/constants/theme';
import Header from './layout/Header';
import HelmetHybrid from './layout/HelmetHybrid';
import { Footer, PlatformFooter } from './layout/Footers';
import TopBarHandler from './layout/TopBarHandler';
import DummyWrapper from './layout/DummyWrapper';
import { message } from './generic/message';

export const StateContext = React.createContext(null);

dayjs.extend(updateLocale);

function LayoutPage({ currentUser, userLoading, children }) {
  const initialCurrentHost = window?.__PRELOADED_STATE__?.Host || null;
  const [platform, setPlatform] = useState(null);
  const [currentHost, setCurrentHost] = useState(initialCurrentHost);
  const [allHosts, setAllHosts] = useState(null);
  const [pageTitles, setPageTitles] = useState([]);
  const [hue, setHue] = useState('233');
  const [rendered, setRendered] = useState(false);
  const [, i18n] = useTranslation();
  const [isDesktop, isMobile] = useMediaQuery([
    '(min-width: 960px)',
    '(max-width: 480px)',
  ]);
  const location = useLocation();
  const { pathname } = location;
  const [tc] = useTranslation('common');

  useLayoutEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

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

  const pathnameSplitted = pathname.split('/');

  useEffect(() => {
    if (pathnameSplitted[1][0] === '@' && !pathnameSplitted[3]) {
      return;
    }
    window.scrollTo(0, 0);
  }, [pathnameSplitted[2]]);

  const getCurrentHost = async () => {
    try {
      const respond = await call('getCurrentHost');
      setCurrentHost(respond);
      setHue(respond?.settings?.hue);
    } catch (error) {
      console.log(error);
    }
  };

  const getPlatform = async () => {
    try {
      const respond = await call('getPlatform');
      setPlatform(respond);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllHosts = async () => {
    try {
      const respond = await call('getAllHosts');
      setAllHosts(respond.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.log(error);
    }
  };

  const getPageTitles = async () => {
    try {
      const respond = await call('getPageTitles');
      setPageTitles(respond);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentHost();
    getPlatform();
    getAllHosts();
    getPageTitles();
  }, []);

  const setSelectedHue = async () => {
    try {
      await call('setHostHue', hue);
      message.success(tc('message.success.update'));
      await getCurrentHost();
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const chakraTheme = generateTheme(hue);

  const hostWithinUser =
    currentUser &&
    currentUser.memberships &&
    currentUser.memberships.find(
      (membership) => membership.host === window.location.host
    );

  const role = hostWithinUser && hostWithinUser.role;
  const canCreateContent =
    role && ['admin', 'contributor'].includes(role);

  const isFederationFooter =
    platform?.isFederationLayout && platform.footer;
  const isLogoSmall =
    !['pages', 'cp'].includes(pathnameSplitted[1]) &&
    Boolean(pathnameSplitted[2]);

  const adminPage = pathnameSplitted[1] === 'admin';

  return (
    <>
      <HelmetHybrid Host={currentHost} />
      <ChakraProvider theme={chakraTheme}>
        <ColorModeProvider>
          <StateContext.Provider
            value={{
              allHosts,
              canCreateContent,
              currentUser,
              currentHost,
              hue,
              isDesktop,
              isMobile,
              pageTitles,
              platform,
              role,
              userLoading,
              getCurrentHost,
              getPageTitles,
              getPlatform,
              setHue,
              setSelectedHue,
            }}
          >
            <DummyWrapper
              animate={rendered && !isDesktop}
              settings={currentHost?.settings}
            >
              {rendered && !adminPage && (
                <TopBarHandler
                  currentUser={currentUser}
                  slideStart={rendered}
                />
              )}
              {!adminPage && (
                <Header
                  Host={currentHost}
                  isLogoSmall={isLogoSmall}
                  pageTitles={pageTitles}
                />
              )}
              {children}
            </DummyWrapper>

            {rendered && !adminPage && (
              <Box>
                <Footer
                  currentHost={currentHost}
                  isFederationFooter={isFederationFooter}
                />
                {isFederationFooter && (
                  <PlatformFooter platform={platform} />
                )}
              </Box>
            )}
          </StateContext.Provider>
        </ColorModeProvider>
      </ChakraProvider>

      {rendered && (
        <Toaster
          containerStyle={{ minWidth: '120px', zIndex: 999999 }}
        />
      )}
    </>
  );
}

export default withTracker((props) => {
  const meSub = Meteor.isClient && Meteor.subscribe('me');
  const currentUser = Meteor.isClient && Meteor.user();
  const userLoading = meSub && !meSub.ready();

  return {
    currentUser,
    userLoading,
    ...props,
  };
})(LayoutPage);
