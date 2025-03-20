import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Center } from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';

import ConfirmModal from '../../generic/ConfirmModal';
import { call } from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import { message } from '../../generic/message';
import Loader from '../../generic/Loader';

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
          borderColor="brand.200"
          borderWidth="2px"
          colorScheme="brand"
          height="48px"
          width={isDesktop ? '240px' : '180px'}
          onClick={() => setModalOpen(true)}
        >
          <Trans i18nKey="common:labels.contact">Contact</Trans>
        </Button>
      </Center>

      <ConfirmModal
        visible={modalOpen}
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
          <Box bg="white" className="text-content" p="4" textAlign="center">
            {HTMLReactParser(contactInfo)}
          </Box>
        ) : (
          <Loader />
        )}
      </ConfirmModal>
    </>
  );
}
