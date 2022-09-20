import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Container, Center, Flex, Link as CLink, Tabs, TabList, Tab } from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { Trans } from 'react-i18next';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import { Alert } from '../../components/message';
import Modal from '../../components/Modal';
import MemberAvatarEtc from '../../components/MemberAvatarEtc';
import MemberWorks from '../works/MemberWorks';
import MemberActivities from '../activities/MemberActivities';
import MemberProcesses from '../processes/MemberProcesses';

function MemberPublic({ history, match, path }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');
  const [ta] = useTranslation('accounts');
  const { username, profileRoute } = match.params;
  const { currentUser, currentHost } = useContext(StateContext);

  useEffect(() => {
    Meteor.call('getUserInfo', username, (error, respond) => {
      if (error) {
        setLoading(false);
        setError(true);
      }
      setUser(respond);
      setLoading(false);
    });
  }, [username]);

  if (loading) {
    return <Loader />;
  }

  if (error || !user) {
    return <Alert margin="medium" message={ta('profile.message.notfound')} />;
  }

  if (match.path === '/@:username' && match.isExact) {
    return <Redirect to={`/@${username}/bio`} />;
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
  //     message.success(`${user.username} is now set as a contributor`);
  //   } catch (error) {
  //     console.log(error);
  //     message.error(error.reason || error.error);
  //   }
  // };

  const getDefaultTabIndex = () => {
    switch (profileRoute) {
      case 'bio':
        return 0;
      case 'works':
        return 1;
      case 'activities':
        return 2;
      case 'processes':
        return 3;
      case 'hosts':
        return 4;
      case 'contact':
        return 5;
      case 'edit':
        return 6;
      default:
        return 0;
    }
  };

  const menu = currentHost?.settings?.menu;
  const worksInMenu = menu.find((item) => item.name === 'works');
  const activitiesInMenu = menu.find((item) => item.name === 'activities');
  const processesInMenu = menu.find((item) => item.name === 'processes');
  const membersInMenu = menu.find((item) => item.name === 'members');

  const tabs = [
    {
      link: `/@${user.username}/bio`,
      label: tc('domains.bio'),
    },
    {
      link: `/@${user.username}/works`,
      label: worksInMenu.label,
    },
    {
      link: `/@${user.username}/activities`,
      label: activitiesInMenu.label,
    },
    {
      link: `/@${user.username}/processes`,
      label: processesInMenu.label,
    },
    {
      link: `/@${user.username}/contact`,
      label: tc('labels.contact'),
    },
  ];

  return (
    <>
      <Flex bg="gray.100">
        <Box p="4" flexBasis="120px">
          <Link to={`/members`}>
            <CLink as="span" textTransform="uppercase">
              {membersInMenu.label}
            </CLink>
          </Link>
        </Box>
        <Center flexBasis="100%">
          <Box w="large">
            <MemberAvatarEtc t={t} tc={tc} user={user} />
          </Box>
        </Center>
        <Box flexBasis="120px" />
      </Flex>
      <Tabs align="center" bg="gray.100" defaultIndex={getDefaultTabIndex()} size="sm">
        <TabList flexWrap="wrap">
          {tabs.map((tab) => (
            <Link key={tab.label} to={tab.link}>
              <Tab _focus={{ boxShadow: 'none' }} as="div" textTransform="uppercase">
                {tab.label}
              </Tab>
            </Link>
          ))}

          {currentUser && currentUser.username === user.username && (
            <Link to={`/@${user.username}/edit`}>
              <Tab _focus={{ boxShadow: 'none' }} as="div" textTransform="uppercase">
                <Trans i18nKey="common:actions.update" />
              </Tab>
            </Link>
          )}
        </TabList>
      </Tabs>

      <Switch path={path} history={history}>
        <Route path="/@:username/bio" render={(props) => <Bio user={user} />} />
        <Route
          path="/@:username/works"
          render={(props) => <MemberWorks user={user} match={match} />}
        />
        <Route
          path="/@:username/activities"
          render={(props) => <MemberActivities user={user} match={match} />}
        />
        <Route
          path="/@:username/processes"
          render={(props) => <MemberProcesses user={user} match={match} />}
        />
        <Route
          path="/@:username/contact"
          render={(props) => (
            <Modal
              isCentered
              isOpen
              title={user.username}
              onClose={() => history.push(`/@${user.username}`)}
            >
              <Container p="4">
                {user.contactInfo
                  ? renderHTML(user.contactInfo)
                  : t('message.contact.empty', { username: user.username })}
              </Container>
            </Modal>
          )}
        />
      </Switch>
    </>
  );
}

function Bio({ user }) {
  if (!user) {
    return null;
  }
  return (
    <Center>
      {user.bio && (
        <Box maxWidth="480px" className="text-content" mt="2" p="4">
          {renderHTML(user.bio)}
        </Box>
      )}
    </Center>
  );
}

export default MemberPublic;
