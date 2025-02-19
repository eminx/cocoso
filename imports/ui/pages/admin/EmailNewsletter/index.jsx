import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Center, Link as CLink, Text } from '@chakra-ui/react';
import ExternalLinkIcon from 'lucide-react/dist/esm/icons/external-link';
import { render as renderEmail } from '@react-email/render';
import { useTranslation } from 'react-i18next';

import { call, resizeImage, uploadImage } from '../../../utils/shared';
import Loader from '../../../generic/Loader';
import { message } from '../../../generic/message';
import Alert from '../../../generic/Alert';
import { StateContext } from '../../../LayoutContainer';
import Modal from '../../../generic/Modal';
import EmailPreview from './EmailPreview';
import EmailForm from './EmailForm';
import ConfirmModal from '../../../generic/ConfirmModal';
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

  if (!state.email) {
    return <Loader />;
  }

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  if (!currentHost || !platform) {
    return null;
  }

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
      <EmailPreview currentHost={currentHost} email={email} imageUrl={imageUrl} />
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
      const uploadedImage = await uploadImage(resizedImage, 'genericEntryImageUpload');
      sendEmail(uploadedImage);
    } catch (error) {
      console.error('Error uploading:', error);
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

  return (
    <>
      <Box>
        {currentHost?.isPortalHost && (
          <Box mb="4">
            <Alert
              message={t('newsletter.portalHost.info', { platform: platform.name })}
              type="info"
            />
          </Box>
        )}

        <Box mb="4">
          <Link target="_blank" to="/newsletters">
            <CLink as="span" color="blue.500" display="flex">
              {t('newsletter.labels.previouslink')}{' '}
              <ExternalLinkIcon size="16px" style={{ marginLeft: '4px', marginTop: '4px' }} />
            </CLink>
          </Link>
        </Box>
        <Text mb="4">{t('newsletter.subtitle')}</Text>

        <Boxling>
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
        actionButtonLabel="Send email"
        isOpen={state.preview}
        motionPreset="slideInBottom"
        scrollBehavior="inside"
        size="2xl"
        title={state?.email?.subject}
        onActionButtonClick={() => {
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

      <ConfirmModal
        confirmButtonProps={{
          isLoading: state.sending,
        }}
        confirmText={t('newsletter.modals.yes')}
        title={t('newsletter.modals.title')}
        visible={state.lastConfirm}
        zIndex={99999}
        onConfirm={() => handleConfirmSendingEmail()}
        onCancel={() =>
          setState((prevState) => ({
            ...prevState,
            lastConfirm: false,
          }))
        }
      >
        {t('newsletter.modals.body')}
      </ConfirmModal>
    </>
  );
}
