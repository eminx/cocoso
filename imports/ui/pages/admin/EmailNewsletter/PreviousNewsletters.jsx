import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Loader,
  Modal,
  Link as CLink,
  Text,
} from '/imports/ui/core';
import NiceList from '/imports/ui/generic/NiceList';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import { currentHostAtom } from '../../../../state';

import EmailPreview from './EmailPreview';

export default function PreviousNewsletters() {
  const currentHost = useAtomValue(currentHostAtom);
  const [emails, setEmails] = useState(null);
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
      <Heading
        color="gray.800"
        fontFamily="'Raleway', sans-serif"
        mb="8"
        size="lg"
      >
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

      <Routes>
        <Route
          path="/:emailId"
          element={
            <NewsletterEmail currentHost={currentHost} emails={emails} />
          }
        />
      </Routes>
    </Box>
  );
}

function NewsletterEmail({ currentHost, emails }) {
  const { emailId } = useParams();
  const navigate = useNavigate();

  const email = emails.find((e) => e._id === emailId);

  if (!email) {
    return null;
  }

  return (
    <Modal
      hideFooter
      hideHeader
      id="previous-newsletters-item"
      open
      size="2xl"
      title={email.subject}
      onClose={() => navigate('/newsletters')}
    >
      <Center p="8">
        <Box>
          <Text color="gray.600" fontSize="sm" mb="4" textAlign="center">
            {email.creationDate.toString()}
          </Text>
          <EmailPreview
            currentHost={currentHost}
            email={email}
            imageUrl={email.imageUrl}
          />
        </Box>
      </Center>
    </Modal>
  );
}
