import React, { useContext, useEffect, useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Box, Center, Divider, Flex, Heading, Image, Link as CLink, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import NiceList from './NiceList';
import { call } from '../utils/shared';
import { message } from './message';
import Loader from './Loader';
import Modal from './Modal';
import EmailPreview from '../pages/admin/EmailNewsletter/EmailPreview';
import { StateContext } from '../LayoutContainer';

export default function PreviousNewsletters() {
  const [emails, setEmails] = useState(null);
  const { currentHost } = useContext(StateContext);
  const [tc] = useTranslation('common');

  useEffect(() => {
    getEmails();
  }, []);

  const getEmails = async () => {
    try {
      const respond = await call('getNewslettersForHost');
      setEmails(respond.reverse());
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  if (!emails) {
    return <Loader />;
  }

  return (
    <Box p="4">
      <Heading color="gray.800" fontFamily="'Raleway', sans-serif" mb="8" size="lg">
        {tc('labels.newsletters')}
      </Heading>
      <NiceList actionsDisabled list={emails} keySelector="_id" spacing="0">
        {(email) => (
          <Box>
            <Flex alignItems="flex-start" mb="4">
              <Image fit="contain" mr="4" src={email.imageUrl} w="100px" />
              <Box>
                <Link to={`/newsletters/${email._id}`}>
                  <CLink as="span">
                    <Heading size="md">{email.subject}</Heading>
                  </CLink>
                </Link>
                <Text fontWeight="bold" mb="2">
                  {email.authorUsername}
                </Text>
                <Text color="gray.600" fontSize="sm">
                  {email.creationDate.toString()}
                </Text>
              </Box>
            </Flex>
            <Divider />
          </Box>
        )}
      </NiceList>

      <Switch>
        <Route
          path="/newsletters/:emailId"
          render={(props) => (
            <NewsletterEmail {...props} currentHost={currentHost} emails={emails} />
          )}
        />
      </Switch>
    </Box>
  );
}

function NewsletterEmail({ currentHost, emails, history, match }) {
  const { emailId } = match.params;

  const email = emails.find((e) => e._id === emailId);

  if (!email) {
    return null;
  }

  return (
    <Modal
      isOpen
      colorScheme="gray"
      placement="centter"
      motionPreset="slideInTop"
      scrollBehavior="inside"
      size="2xl"
      title={email.subject}
      onClose={() => history.push('/newsletters')}
    >
      <Center>
        <Box>
          <Text color="gray.600" fontSize="sm" mb="4" textAlign="center">
            {email.creationDate.toString()}
          </Text>
          <EmailPreview currentHost={currentHost} email={email} imageUrl={email.imageUrl} />
        </Box>
      </Center>
    </Modal>
  );
}
