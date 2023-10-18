import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Heading, Link as CLink, Text } from '@chakra-ui/react';

import NiceList from '../../../components/NiceList';
import { call } from '../../../utils/shared';
import { message } from '../../../components/message';
import Loader from '../../../components/Loader';

export default function NewsletterEmails({}) {
  const [emails, setEmails] = useState(null);

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
    <NiceList actionsDisabled={!isAdmin} keySelector="_id" list={emails} spacing="0">
      {(email) => (
        <Link to={`/newsletter-emails/${email._id}}`}>
          <Flex align="center">
            <CLink as="span">
              <Heading>{email.subject}</Heading>
            </CLink>
            <Text>{email.creationDate}</Text>
          </Flex>
        </Link>
      )}
    </NiceList>
  );
}
