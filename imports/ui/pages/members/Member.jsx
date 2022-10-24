import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Container, Center, Flex, Link as CLink, Text } from '@chakra-ui/react';
import renderHTML from 'react-render-html';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import { Alert } from '../../components/message';
import Modal from '../../components/Modal';
import MemberAvatarEtc from '../../components/MemberAvatarEtc';
import MemberWorks from '../works/MemberWorks';
import MemberActivities from '../activities/MemberActivities';
import MemberProcesses from '../processes/MemberProcesses';
import Tabs from '../../components/Tabs';

function MemberPublic({ history, match, path }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');
  const [ta] = useTranslation('accounts');
  const { username } = match.params;
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
    return (
      <Center p="8">
        <Alert message={ta('profile.message.notfound')} />
      </Center>
    );
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

  const { menu, name } = currentHost?.settings;
  const membersInMenu = menu.find((item) => item.name === 'members');

  const tabs = [
    {
      path: `/@${username}/bio`,
      title: tc('domains.bio'),
      isVisible: true,
    },
  ];

  menu
    ?.filter((item) => {
      return ['works', 'activities', 'processes'].includes(item.name) && item.isVisible;
    })
    ?.forEach((item) => {
      tabs.push({
        path: `/@${username}/${item.name}`,
        title: item.label,
      });
    });

  tabs.push({
    path: `/@${username}/contact`,
    title: tc('labels.contact'),
  });

  if (currentUser && currentUser.username === username) {
    tabs.push({
      path: `/@${username}/edit`,
      title: <b>{tc('actions.update')}</b>,
    });
  }

  const tabIndex = tabs.findIndex((tab) => tab.path === history?.location?.pathname);

  return (
    <>
      <Flex p="4">
        <Link to="/">
          <CLink as="span" fontWeight="bold">
            {name}
          </CLink>
        </Link>
        <Text mx="2">/</Text>
        <Link to="/members">
          <CLink as="span">{membersInMenu.label}</CLink>
        </Link>
        <Text mx="2">/</Text>
        <Text>{currentUser.username}</Text>
      </Flex>

      <Box>
        <Center flexBasis="100%">
          <Box w="large">
            <MemberAvatarEtc t={t} tc={tc} user={user} />
          </Box>
        </Center>
      </Box>
      <Tabs align="center" index={tabIndex} size="sm" tabs={tabs} />

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
