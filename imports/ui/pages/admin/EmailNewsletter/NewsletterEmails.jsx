import React, { useContext, useEffect, useState } from 'react';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import { Box, Center, Divider, Flex, Heading, Image, Link as CLink, Text } from '@chakra-ui/react';

import NiceList from '../../../components/NiceList';
import { call } from '../../../utils/shared';
import { message } from '../../../components/message';
import Loader from '../../../components/Loader';
import Modal from '../../../components/Modal';
import EmailPreview from './EmailPreview';
import { StateContext } from '../../../LayoutContainer';

export default function NewsletterEmails() {
  const [emails, setEmails] = useState(null);
  const { currentHost } = useContext(StateContext);
  const history = useHistory();

  useEffect(() => {
    getEmails();
  }, []);

  const getEmails = async () => {
    try {
      const respond = await call('getNewsletterEmailsForHost');
      setEmails(respond);
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
        Newsletter Emails
      </Heading>
      <NiceList actionsDisabled list={emails} keySelector="_id" spacing="0">
        {(email) => (
          <>
            <Flex mb="4">
              <Image mr="4" src={email.imageUrl} w="100px" />
              <Box>
                <Link to={`/newsletter-emails/${email._id}`}>
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
          </>
        )}
      </NiceList>

      <Switch history={history}>
        <Route
          path="/newsletter-emails/:emailId"
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

  return (
    <Modal
      isOpen
      placement="centter"
      motionPreset="slideInTop"
      scrollBehavior="inside"
      size="2xl"
      title={email.subject}
      onClose={() => history.push('/newsletter-emails')}
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
