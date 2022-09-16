import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Container, Center, Tabs, TabList, Tab } from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { Trans } from 'react-i18next';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import { Alert } from '../../components/message';
import MemberAvatarEtc from '../../components/MemberAvatarEtc';
import MemberWorks from '../works/MemberWorks';
import Header from '../../components/Header';

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

  const worksInMenu =
    currentHost &&
    currentHost.settings.menu &&
    currentHost.settings.menu.find((item) => item.name === 'works');

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
      default:
        return 0;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <Center>
        <Box w="large">
          <MemberAvatarEtc t={t} tc={tc} user={user} />
        </Box>
      </Center>

      {currentUser && currentUser.username === user.username && (
        <Center p="2">
          <Link to={`/@${user.username}/edit`}>
            <Button as="span" variant="ghost" size="sm">
              <Trans i18nKey="common:actions.update" />
            </Button>
          </Link>
        </Center>
      )}

      <Tabs align="center" defaultIndex={getDefaultTabIndex()}>
        <TabList>
          <Link to={`/@${user.username}/bio`}>
            <Tab _focus={{ boxShadow: 'none' }} as="div">
              {tc('domains.bio')}
            </Tab>
          </Link>

          <Link to={`/@${user.username}/works`}>
            <Tab _focus={{ boxShadow: 'none' }} as="div">
              {worksInMenu.label}
            </Tab>
          </Link>

          <Link to={`/@${user.username}/contact`}>
            <Tab _focus={{ boxShadow: 'none' }} as="div">
              {tc('labels.contact')}
            </Tab>
          </Link>
          {/* <Tab as="div">
            <Link to={`/@${user.username}/activities`}>Activities</Link>
          </Tab> */}
        </TabList>
      </Tabs>

      <Switch path={path} history={history}>
        <Route path="/@:username/bio" render={(props) => <Bio user={user} />} />
        <Route
          path="/@:username/works"
          render={(props) => <MemberWorks user={user} match={match} />}
        />
        <Route
          path="/@:username/contact"
          render={(props) => (
            <Container p="4">
              {user.contactInfo
                ? renderHTML(user.contactInfo)
                : t('message.contact.empty', { username: user.username })}
            </Container>
          )}
        />
        {/* <Route path="/@:username/works" component={MyWorks} /> */}
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
