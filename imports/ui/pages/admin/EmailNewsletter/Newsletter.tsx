import React from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';

import { Box, Center, Modal, Text } from '/imports/ui/core';
import { currentHostAtom } from '/imports/state';

import EmailPreview from './EmailPreview';

export default function NewsletterEmail() {
  const currentHost = useAtomValue(currentHostAtom);
  const { newsletter } = useLoaderData();
  const navigate = useNavigate();

  const email = newsletter;

  if (!email) {
    return null;
  }

  return (
    <>
      <Modal
        hideFooter
        id="previous-newsletters-item"
        open={Boolean(email)}
        size="2xl"
        title={email.subject}
        onClose={() => navigate('/newsletters')}
      >
        <Center p="8">
          <Box>
            <Center mb="4">
              <Text color="gray.600" fontSize="sm" textAlign="center">
                {email?.creationDate?.toString()}
              </Text>
            </Center>

            <EmailPreview currentHost={currentHost} email={email} />
          </Box>
        </Center>
      </Modal>
    </>
  );
}
