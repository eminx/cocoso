import React, { useContext, useEffect } from 'react';
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex } from '@chakra-ui/react';
import HTMLReactParser from 'html-react-parser';

import { StateContext } from '../LayoutContainer';
import MemberAvatarEtc from '../components/MemberAvatarEtc';
import MemberWorks from '../pages/works/MemberWorks';
import MemberActivities from '../pages/activities/MemberActivities';
import MemberGroups from '../pages/groups/MemberGroups';
import Tabs from '../components/Tabs';
import SexyThumb from '../components/SexyThumb';
import BackLink from '../components/BackLink';

function stripHtml(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function Bio({ isSelfAccount, tc, user }) {
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
    <Flex justifyContent="center" mb="4">
      <Box
        bg="white"
        className="text-content"
        maxW="480px"
        p="4"
        borderLeft="4px solid"
        borderColor="brand.500"
        w="100%"
      >
        {HTMLReactParser(user.bio)}
      </Box>
    </Flex>
  );
}

// function ContactInfo({ user }) {
//   if (!user || !user.contactInfo) {
//     return null;
//   }

//   return (
//     <Flex justifyContent="center">
//       <Box maxWidth="480px" className="text-content" p="4">
//         {HTMLReactParser(user.contactInfo)}
//       </Box>
//     </Flex>
//   );
// }

export default function UserHybrid({ user, Host }) {
  const [tc] = useTranslation('common');
  const location = useLocation();
  const { usernameSlug } = useParams();
  const [, username] = usernameSlug.split('@');

  const { currentUser } = useContext(StateContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [username]);

  if (usernameSlug[0] !== '@') {
    return null;
  }

  if (!user) {
    return null;
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

  const { menu } = Host?.settings;

  const tabs = [];

  menu
    ?.filter((item) => ['activities', 'groups', 'works'].includes(item.name) && item.isVisible)
    ?.forEach((item) => {
      tabs.push({
        path: `${item.name}`,
        title: item.label,
      });
    });

  const pathnameLastPart = location.pathname.split('/').pop();
  const tabIndex = tabs.findIndex((tab) => tab.path === pathnameLastPart);
  const isSelfAccount = currentUser && currentUser.username === username;
  const isPortalHost = Host?.isPortalHost;
  const members = menu?.find((item) => item.name === 'people');

  return (
    <>
      <Box p="2">
        <BackLink backLink={{ label: members?.label, value: '/people' }} />
      </Box>

      <Center>
        <Box maxW="600px">
          <Center>
            <MemberAvatarEtc isThumb={false} user={user} />
          </Center>
          <Center>
            <Bio isSelfAccount={isSelfAccount} tc={tc} user={user} />
          </Center>
        </Box>
      </Center>

      <Center>
        <Box maxW="600px">
          <Tabs align="center" index={tabIndex} tabs={tabs} />

          <Box pt="4">
            <Routes>
              <Route
                path="activities"
                element={
                  <MemberActivities currentHost={Host} isPortalHost={isPortalHost} user={user} />
                }
              />
              <Route
                path="groups"
                element={
                  <MemberGroups currentHost={Host} isPortalHost={isPortalHost} user={user} />
                }
              />
              <Route
                path="works"
                element={<MemberWorks currentHost={Host} isPortalHost={isPortalHost} user={user} />}
              />
            </Routes>
          </Box>
        </Box>
      </Center>
    </>
  );
}
