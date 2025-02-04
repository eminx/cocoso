import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex } from '@chakra-ui/react';
import parseHtml from 'html-react-parser';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import { Alert } from '../../components/message';
import MemberAvatarEtc from '../../components/MemberAvatarEtc';
import MemberWorks from '../works/MemberWorks';
import MemberActivities from '../activities/MemberActivities';
import MemberGroups from '../groups/MemberGroups';
import Tabs from '../../components/Tabs';
import { call } from '../../utils/shared';
import NewEntryHelper from '../../components/NewEntryHelper';
import SexyThumb from '../../components/SexyThumb';
import BackLink from '../../components/BackLink';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const [tc] = useTranslation('common');
  const [ta] = useTranslation('accounts');
  const location = useLocation();
  const { usernameSlug } = useParams();
  const [empty, username] = usernameSlug.split('@');

  const { currentUser, currentHost, isDesktop, platform } = useContext(StateContext);

  useEffect(() => {
    getUserInfo();
  }, [username]);

  const getUserInfo = async () => {
    try {
      const respond = await call('getUserInfo', username);
      setUser(respond);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  if (usernameSlug[0] !== '@') {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  if (error || !user) {
    return (
      <Center p="8">
        <Alert message={ta('profile.message.notfound')} />
      </Center>
    );
  }

  // const setAsParticipant = async (user) => {
  //   try {
  //     await call('setAsParticipant', user.id);
  //     message.success(`${user.username} is now set back as a participant`);
  //   } catch (error) {
  //     console.log(error);
  //     message.error(error.reason || error.error);
  //   }
  // };

  // const setAsContributor = async (user) => {
  //   try {
  //     await call('setAsContributor', user.id);
  //     message.success(`${user.username} is now set as a cocreator`);
  //   } catch (error) {
  //     console.log(error);
  //     message.error(error.reason || error.error);
  //   }
  // };

  const { menu } = currentHost?.settings;

  const tabs = [];

  if (!isDesktop) {
    tabs.push({
      path: 'bio',
      title: tc('domains.bio'),
      isVisible: true,
    });
  }

  menu
    ?.filter((item) => {
      return ['works', 'activities', 'groups'].includes(item.name) && item.isVisible;
    })
    ?.forEach((item) => {
      tabs.push({
        path: `${item.name}`,
        title: item.label,
      });
    });

  tabs.push({
    path: 'contact',
    title: tc('labels.contact'),
  });

  if (currentUser && currentUser.username === username) {
    tabs.push({
      path: '/edit',
      title: <b>{tc('actions.update')}</b>,
    });
  }

  const pathnameLastPart = location.pathname.split('/').pop();
  const tabIndex = tabs.findIndex((tab) => tab.path === pathnameLastPart);
  if (tabs && !tabs.find((tab) => tab.path === pathnameLastPart)) {
    return <Navigate to={tabs[0].path} />;
  }

  const isSelfAccount = currentUser && currentUser.username === username;

  const isFederationLayout = platform?.isFederationLayout;

  const members = menu?.find((item) => item.name === 'people');

  return (
    <>
      <Box p="2">
        <BackLink backLink={{ label: members?.label, value: '/people' }} />
      </Box>
      {/* <Grid templateColumns={isDesktop ? '3fr 4fr 1fr' : '1fr'}> */}
      {/* <GridItem mx={isDesktop ? '4' : '0'} mt="2" mb="4"> */}
      <Center>
        <Box maxW="600px">
          <Center>
            <Box>
              <MemberAvatarEtc user={user} />
            </Box>
          </Center>
          <Center>
            {isDesktop && <Bio isDesktop isSelfAccount={isSelfAccount} tc={tc} user={user} />}
          </Center>
        </Box>
      </Center>
      {/* </GridItem> */}

      {/* <GridItem pl={isDesktop ? '12' : '0'}> */}
      <Center>
        <Box maxW="600px">
          <Tabs align="center" index={tabIndex} tabs={tabs} px="4" />

          <Box pt="4" px={isDesktop ? '4' : '0'}>
            <Routes>
              {!isDesktop && (
                <Route
                  path="bio"
                  element={
                    <Bio isDesktop={false} isSelfAccount={isSelfAccount} tc={tc} user={user} />
                  }
                />
              )}
              <Route
                path="activities"
                element={
                  <MemberActivities
                    currentHost={currentHost}
                    isFederationLayout={isFederationLayout}
                    isSelfAccount={isSelfAccount}
                    user={user}
                  />
                }
              />
              <Route
                path="groups"
                element={
                  <MemberGroups
                    currentHost={currentHost}
                    isFederationLayout={isFederationLayout}
                    isSelfAccount={isSelfAccount}
                    user={user}
                  />
                }
              />
              <Route
                path="works"
                element={
                  <MemberWorks
                    currentHost={currentHost}
                    isFederationLayout={isFederationLayout}
                    isSelfAccount={isSelfAccount}
                    user={user}
                  />
                }
              />
              <Route
                path="contact"
                element={
                  <ContactInfo
                    isDesktop={false}
                    isSelfAccount={isSelfAccount}
                    tc={tc}
                    user={user}
                  />
                }
              />
            </Routes>
          </Box>
        </Box>
      </Center>
    </>
  );
}

function stripHtml(html) {
  let tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function Bio({ isDesktop, isSelfAccount, tc, user }) {
  if (!user || !user.bio) {
    return null;
  }

  const bareBio = stripHtml(user.bio);

  if (isSelfAccount && (!bareBio || bareBio.length < 2)) {
    return (
      <Center p="4" mb="4" w="100%">
        <Link to={`/@${user?.username}/edit`} style={{ width: '100%' }}>
          <SexyThumb
            subTitle={tc('menu.member.settings')}
            title={tc('message.newentryhelper.bio.title')}
          />
        </Link>
      </Center>
    );
  }

  if (!bareBio || bareBio.length < 2) {
    return null;
  }

  return (
    <Flex justifyContent={isDesktop ? 'flex-start' : 'center'} mb="4" p="2">
      <Box
        bg="white"
        className="text-content"
        maxW="480px"
        p="4"
        borderLeft="4px solid"
        borderColor="brand.500"
        w="100%"
      >
        {parseHtml(user.bio)}
      </Box>
    </Flex>
  );
}

function ContactInfo({ isDesktop, isSelfAccount, tc, user }) {
  if (!user || !user.contactInfo) {
    return null;
  }

  const bareContactInfo = stripHtml(user.contactInfo);

  if (isSelfAccount && (!bareContactInfo || bareContactInfo.length < 3)) {
    return (
      <NewEntryHelper
        title={tc('message.newentryhelper.contactInfo.title')}
        buttonLabel={tc('menu.member.settings')}
        buttonLink={`/@${user?.username}/edit`}
      >
        {tc('message.newentryhelper.contactInfo.description')}
      </NewEntryHelper>
    );
  }

  return (
    <Flex justifyContent={isDesktop ? 'flex-start' : 'center'}>
      <Box maxWidth="480px" className="text-content" p="4">
        {parseHtml(user.contactInfo)}
      </Box>
    </Flex>
  );
}

export default Profile;
