import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link';
import { render as renderEmail } from '@react-email/render';
import { useTranslation } from 'react-i18next';

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
import { call, resizeImage, uploadImage } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import { StateContext } from '/imports/ui/LayoutContainer';

import EmailPreview from './EmailPreview';
import EmailForm from './EmailForm';
import Boxling from '../Boxling';

const emailModel = {
  appeal: '',
  body: '',
  footer: '',
  image: {
    imageUrl: '',
    uploadableImage: null,
    uploadableImageLocal: null,
  },
  subject: '',
  items: {
    activities: [],
    works: [],
  },
};

export default function EmailNewsletter() {
  const [state, setState] = useState({
    sending: false,
    email: emailModel,
    preview: false,
    lastConfirm: false,
  });
  const { currentHost, currentUser, role, platform } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const handleFormChange = (field, value) => {
    const newEmail = {
      ...state.email,
    };
    newEmail[field] = value;
    setState((prevState) => ({
      ...prevState,
      email: newEmail,
    }));
  };

  const handleFormConfirm = () => {
    setState((prevState) => ({
      ...prevState,
      preview: true,
    }));
  };

  const setUploadableImage = (files) => {
    if (files.length > 1) {
      message.error(tc('plugins.fileDropper.single'));
      return;
    }
    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        setState((prevState) => ({
          ...prevState,
          email: {
            ...prevState.email,
            image: {
              uploadableImage,
              uploadableImageLocal: reader.result,
              imageUrl: null,
            },
          },
        }));
      },
      false
    );
  };

  const handleSelectItems = (items) => {
    setState((prevState) => ({
      ...prevState,
      email: {
        ...prevState.email,
        items,
      },
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
      imageUrl,
      subject: email.subject,
    };

    try {
      await call('sendNewsletter', emailValues, emailHtml, imageUrl);
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
        sending: false,
        lastConfirm: false,
      }));
    }
  };

  const uploadLocalImage = async () => {
    setState((prevState) => ({
      ...prevState,
      sending: true,
      preview: false,
    }));

    const image = state.email?.image;
    const { uploadableImage } = image;

    try {
      const resizedImage = await resizeImage(uploadableImage, 1200);
      const uploadedImage = await uploadImage(
        resizedImage,
        'genericEntryImageUpload'
      );
      sendEmail(uploadedImage);
    } catch (error) {
      message.error(error.reason);
    }
  };

  const handleConfirmSendingEmail = () => {
    const { appeal, body, image, items, subject } = state.email;
    if (!appeal || !subject) {
      message.error(t('newsletter.error.required'));
      return;
    }

    if (
      (!body || body.length < 3) &&
      !image &&
      !image?.uploadableImageLocal &&
      items.length === 0
    ) {
      message.error(t('newsletter.error.required'));
      return;
    }

    setState((prevState) => ({
      ...prevState,
      sending: true,
    }));

    if (state.email?.image?.uploadableImage) {
      uploadLocalImage();
    } else {
      sendEmail();
    }
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
          <EmailForm
            currentHost={currentHost}
            email={state.email}
            onSelectItems={handleSelectItems}
            onChange={handleFormChange}
            onSubmit={handleFormConfirm}
            setUploadableImage={setUploadableImage}
          />
        </Boxling>
      </Box>

      <Modal
        confirmButtonLabel={t('newsletter.modals.send')}
        open={state.preview}
        // motionPreset="slideInBottom"
        // scrollBehavior="inside"
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
          <EmailPreview currentHost={currentHost} email={state.email} />
        </Center>
      </Modal>

      <Modal
        confirmButtonProps={{
          isLoading: state.sending,
        }}
        confirmText={t('newsletter.modals.yes')}
        open={state.lastConfirm}
        title={t('newsletter.modals.title')}
        // style={{ zIndex: 99999 }}
        onConfirm={() => handleConfirmSendingEmail()}
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
