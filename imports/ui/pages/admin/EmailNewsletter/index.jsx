import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link';
import { render as renderEmail } from '@react-email/render';
import { useTranslation } from 'react-i18next';
import { atom, useAtom, useAtomValue } from 'jotai';

import {
  Alert,
  Box,
  Button,
  Center,
  Link as CLink,
  Loader,
  Modal,
  Text,
} from '/imports/ui/core';
import { call, resizeImage, uploadImage } from '/imports/api/_utils/shared';
import { message } from '/imports/ui/generic/message';
import {
  currentHostAtom,
  currentUserAtom,
  platformAtom,
  roleAtom,
} from '/imports/state';

import EmailPreview from './EmailPreview';
import EmailForm from './EmailForm';
import Boxling from '../Boxling';

const emailModel = {
  appeal: '',
  body: [],
  footer: '',
  subject: '',
  items: {
    activities: [],
    works: [],
  },
};

export const newsletterAtom = atom({
  email: emailModel,
  lastConfirm: false,
  preview: false,
  sending: false,
  uploadingImages: false,
});

export default function EmailNewsletter() {
  const currentHost = useAtomValue(currentHostAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const platform = useAtomValue(platformAtom);
  const role = useAtomValue(roleAtom);
  const [state, setState] = useAtom(newsletterAtom);

  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const handleSubmit = () => {
    setState((prevState) => ({
      ...prevState,
      preview: true,
    }));
  };

  const sendEmail = async (imageUrl) => {
    const { email } = state;

    const emailHtml = renderEmail(
      <EmailPreview
        currentHost={currentHost}
        email={email}
        imageUrl={imageUrl}
      />
    );

    const emailValues = {
      appeal: email.appeal,
      body: email.body,
      footer: email.footer,
      items: email.items,
      subject: email.subject,
    };

    try {
      await call('sendNewsletter', emailValues, emailHtml);
      setState((prevState) => ({
        ...prevState,
        email: emailModel,
      }));
      message.success(t('newsletter.notification.success.emailsent'));
    } catch (error) {
      message.error(error.reason || error.error);
    } finally {
      setState((prevState) => ({
        ...prevState,
        lastConfirm: false,
        sending: false,
        uploadingImages: false,
      }));
    }
  };

  const confirmSendingEmail = () => {
    const { appeal, body, items, subject } = state.email;
    if (!subject) {
      message.error(t('newsletter.error.required'));
      return;
    }

    if ((!body || body.length < 1) && items.length === 0) {
      message.error(t('newsletter.error.required'));
      return;
    }

    setState((prevState) => ({
      ...prevState,
      uploadingImages: true,
    }));
  };

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  if (!currentHost || !platform) {
    return null;
  }

  if (!state.email) {
    return <Loader />;
  }

  return (
    <>
      <Box>
        {currentHost?.isPortalHost && (
          <Box mb="4">
            <Alert
              message={t('newsletter.portalHost.info', {
                platform: platform.name,
              })}
              type="info"
            />
          </Box>
        )}

        <Center p="4" mb="4">
          <Link target="_blank" to="/newsletters">
            <Button
              colorScheme="blue"
              leftIcon={<ExternalLinkIcon />}
              variant="ghost"
            >
              {t('newsletter.labels.previouslink')}{' '}
            </Button>
          </Link>
        </Center>

        <Text>{t('newsletter.subtitle')}</Text>

        <Boxling mt="4">
          <EmailForm currentHost={currentHost} onSubmit={handleSubmit} />
        </Boxling>
      </Box>

      <Modal
        confirmButtonLabel={t('newsletter.modals.send')}
        id="email-newsletter-preview"
        open={state.preview}
        size="3xl"
        title={state?.email?.subject}
        onConfirm={() => {
          setState((prevState) => ({
            ...prevState,
            preview: false,
            lastConfirm: true,
          }));
        }}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            preview: false,
          }))
        }
      >
        <Center>
          {/* <EmailPreview currentHost={currentHost} email={state.email} /> */}
        </Center>
      </Modal>

      <Modal
        confirmButtonProps={{
          isLoading: state.sending,
        }}
        confirmText={t('newsletter.modals.yes')}
        id="email-newsletter-confirm-sending"
        open={state.lastConfirm}
        title={t('newsletter.modals.title')}
        onConfirm={() => confirmSendingEmail()}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            lastConfirm: false,
          }))
        }
      >
        {t('newsletter.modals.body')}
      </Modal>
    </>
  );
}
