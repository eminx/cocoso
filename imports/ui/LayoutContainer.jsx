import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, ChakraProvider, ColorModeProvider, useMediaQuery } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/sv';
import 'moment/locale/tr';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

import { call } from './utils/shared';
import { generateTheme } from './utils/constants/theme';
import Header from './layout/Header';
import HelmetHybrid from './layout/HelmetHybrid';
import { Footer, PlatformFooter } from './layout/Footers';
import TopBarHandler from './layout/TopBarHandler';

export const StateContext = React.createContext(null);

dayjs.extend(updateLocale);

function LayoutPage({ currentUser, userLoading, children }) {
  const initialCurrentHost = window?.__PRELOADED_STATE__?.Host || null;
  const [platform, setPlatform] = useState(null);
  const [currentHost, setCurrentHost] = useState(initialCurrentHost);
  const [allHosts, setAllHosts] = useState(null);
  const [hue, setHue] = useState('233');
  const [rendered, setRendered] = useState(false);
  const [tc, i18n] = useTranslation();
  const [isDesktop] = useMediaQuery('(min-width: 960px)');
  const location = useLocation();
  const { pathname } = location;

  useLayoutEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  useEffect(() => {
    moment.locale(i18n?.language || 'en-gb', {
      week: {
        dow: 1,
      },
    });
    dayjs.updateLocale('en', {
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
      // console.log(error);
    }
  };

  useEffect(() => {
    getCurrentHost();
    getPlatform();
    getAllHosts();
  }, []);

  const setSelectedHue = async () => {
    try {
      await call('setHostHue', hue);
      // message.success(tc('message.success.update'));
      await getCurrentHost();
    } catch (error) {
      // message.error(error.reason || error.error);
    }
  };

  const chakraTheme = generateTheme(hue);

  const hostWithinUser =
    currentUser &&
    currentUser.memberships &&
    currentUser.memberships.find((membership) => membership.host === window.location.host);

  const role = hostWithinUser && hostWithinUser.role;
  const canCreateContent = role && ['admin', 'contributor'].includes(role);

  // const menu = currentHost?.settings?.menu;
  // const pagesWithHeaderAndFooter = menu && [
  //   ...menu?.map((item) => '/' + item?.name),
  //   '/forgot-password',
  //   '/reset-password',
  //   '/terms-&-privacy-policy',
  //   '/communities',
  // ];

  // const isLargerLogo =
  //   pagesWithHeaderAndFooter?.includes(pathname) || pathname.substring(0, 6) === '/pages';

  const isFederationFooter = platform?.isFederationLayout && platform.footer;

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
              platform,
              role,
              userLoading,
              getCurrentHost,
              getPlatform,
              setHue,
              setSelectedHue,
            }}
          >
            <Box bg="gray.100" minH="1800px">
              <Header Host={currentHost} />
              {rendered && <TopBarHandler currentUser={currentUser} slideStart={rendered} />}
              {children}
            </Box>

            <Footer currentHost={currentHost} isFederationFooter={isFederationFooter} tc={tc} />
            {isFederationFooter && <PlatformFooter platform={platform} />}
          </StateContext.Provider>
        </ColorModeProvider>
      </ChakraProvider>
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
