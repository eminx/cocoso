import React, { useContext, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';

import { Box, Button, Center, Modal, Loader } from '/imports/ui/core';

import { call } from '../../utils/shared';
import { message } from '../../generic/message';
import { StateContext } from '../../LayoutContainer';

export default function ContactInfo({ username }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { isDesktop } = useContext(StateContext);
  const [contactInfo, setContactInfo] = useState(null);

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
            {HTMLReactParser(contactInfo)}
          </Box>
        ) : (
          <Loader />
        )}
      </Modal>
    </>
  );
}
