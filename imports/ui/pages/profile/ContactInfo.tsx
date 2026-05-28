import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { useAtomValue } from 'jotai';

import {
  Box,
  Button,
  Center,
  Flex,
  Loader,
  Modal,
  Text,
} from '/imports/ui/core';

import { currentUserAtom, isDesktopAtom } from '../../../state';
import { call } from '../../../api/_utils/shared';
import { message } from '../../generic/message';

export default function ContactInfo({
  username,
  userId,
}: {
  username: string;
  userId?: string;
}) {
  const isDesktop = useAtomValue(isDesktopAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [startingConvo, setStartingConvo] = useState(false);

  if (!username) {
    return null;
  }

  const getContactInfo = async () => {
    try {
      const response = await call('getUserContactInfo', username);
      setContactInfo(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getContactInfo();
  }, []);

  const handleSendMessage = async () => {
    if (startingConvo || !userId) return;
    setStartingConvo(true);
    try {
      const conversationId = await Meteor.callAsync(
        'directMessages_findOrCreate',
        userId
      );
      navigate(`/admin/messages/${conversationId}`);
    } catch (err: any) {
      message.error(err.reason || err.message);
    } finally {
      setStartingConvo(false);
    }
  };

  const showMessageButton = userId && currentUser && currentUser._id !== userId;

  return (
    <>
      <Center>
        <Button
          size={isDesktop ? 'lg' : 'md'}
          onClick={() => setModalOpen(true)}
        >
          <Trans i18nKey="common:labels.contact">Contact</Trans>
        </Button>
      </Center>

      <Modal
        id="contact-info"
        open={modalOpen}
        title={
          <>
            <Trans i18nKey="common:labels.contact">Contact</Trans>
            {`: ${username}`}
          </>
        }
        hideFooter
        onCancel={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
      >
        {contactInfo ? (
          <Box
            bg="white"
            className="text-content"
            p="4"
            css={{ textAlign: 'center' }}
          >
            {HTMLReactParser(DOMPurify.sanitize(contactInfo))}
          </Box>
        ) : (
          <Loader />
        )}

        {showMessageButton && (
          <Flex direction="column" align="center" gap="1" p="4" pt="2">
            <Button
              colorScheme="theme"
              isLoading={startingConvo}
              size="sm"
              variant="outline"
              onClick={handleSendMessage}
            >
              <Trans i18nKey="accounts:messages.sendPrivate">
                Send a private message
              </Trans>
            </Button>
            <Text color="gray.600" size="xs" css={{ fontStyle: 'italic' }}>
              <Trans i18nKey="accounts:messages.e2eeNote">
                End-to-end encrypted
              </Trans>
            </Text>
          </Flex>
        )}
      </Modal>
    </>
  );
}
