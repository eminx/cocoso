import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Body,
  Container,
  Head,
  Heading as EmHeading,
  Html,
  Img,
  Text as EmText,
} from '@react-email/components';
import renderHTML from 'react-render-html';
import { render as renderEmail } from '@react-email/render';

import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import { call, resizeImage, uploadImage } from '../../utils/shared';
import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import FormField from '../../components/FormField';
import { adminMenu } from '../../utils/constants/general';
import Breadcrumb from '../../components/Breadcrumb';
import ReactQuill from '../../components/Quill';
import FileDropper from '../../components/FileDropper';
import Modal from '../../components/Modal';

const emailModel = {
  appeal: '',
  body: '',
  image: {
    imageUrl: '',
    uploadableImage: null,
    uploadableImageLocal: null,
  },
  subject: '',
  items: [],
};

function EmailNewsletter({ history }) {
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState(emailModel);
  const [isPreview, setIsPreview] = useState(false);
  const { currentUser, role } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  if (!email) {
    return <Loader />;
  }

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  const handleFormConfirm = (values) => {
    setEmail({
      ...email,
      ...values,
    });
    setIsPreview(true);
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
        setEmail({
          ...email,
          image: {
            uploadableImage,
            uploadableImageLocal: reader.result,
            imageUrl: null,
          },
        });
      },
      false
    );
  };

  const uploadLocalImage = async () => {
    setIsSending(true);
    setIsPreview(false);

    const { image } = email;
    const { uploadableImage } = image;

    try {
      const resizedImage = await resizeImage(uploadableImage, 800);
      const uploadedImage = await uploadImage(resizedImage, 'activityImageUpload');
      handleSendEmail(uploadedImage);
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
    }
  };

  const handleSendEmail = async (imageUrl) => {
    const emailHtml = renderEmail(<EmailPreview email={email} imageUrl={imageUrl} />);

    try {
      await call('sendEmail', 'emin@tuta.io', email.subject, emailHtml);
      message.success(tc('message.success.update'));
    } catch (error) {
      message.error(error.reason || error.error);
    } finally {
      setIsSending(false);
    }
  };

  const pathname = history && history.location.pathname;

  const furtherBreadcrumbLinks = [
    {
      label: 'Admin',
      link: '/admin/settings',
    },
    {
      label: t('emails.label'),
      link: null,
    },
  ];

  return (
    <>
      <Box p="4">
        <Breadcrumb furtherItems={furtherBreadcrumbLinks} />
      </Box>

      {isSending ? (
        <Text>Sending the email...</Text>
      ) : (
        <Template
          heading={t('emails.label')}
          leftContent={
            <Box>
              <ListMenu pathname={pathname} list={adminMenu} />
            </Box>
          }
        >
          <Box py="4" mb="4">
            <Heading size="md" mb="4">
              {email.subject}
            </Heading>
            <EmailForm
              email={email}
              onSubmit={(values) => handleFormConfirm(values)}
              setUploadableImage={setUploadableImage}
            />
          </Box>
        </Template>
      )}

      <Modal
        actionButtonLabel="Send email"
        isOpen={isPreview}
        // placement="center"
        motionPreset="slideInBottom"
        scrollBehavior="inside"
        size="lg"
        title="Preview Email"
        onActionButtonClick={() => uploadLocalImage()}
        onClose={() => setIsPreview(false)}
      >
        <EmailPreview email={email} />
      </Modal>
    </>
  );
}

function EmailForm({ email, onSubmit, setUploadableImage }) {
  const { control, handleSubmit, register, formState } = useForm({
    email,
  });
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const { isDirty, isSubmitting } = formState;

  const { image } = email;
  const { imageUrl, uploadableImageLocal } = image;

  return (
    <>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="4">
          <FormField
            label={t('emails.form.image.label')}
            helperText={
              uploadableImageLocal || imageUrl
                ? tc('plugins.fileDropper.replace')
                : t('emails.form.image.helper')
            }
          >
            <Center>
              <FileDropper
                imageUrl={imageUrl}
                setUploadableImage={setUploadableImage}
                uploadableImageLocal={uploadableImageLocal}
              />
            </Center>
          </FormField>

          <FormField label={t('emails.form.subject.label')}>
            <Input {...register('subject')} placeholder={t('emails.form.subject.holder')} />
          </FormField>

          <FormField label={t('emails.form.appeal.label')}>
            <InputGroup w="280px">
              <Input {...register('appeal')} placeholder={t('emails.form.appeal.holder')} />
              <InputRightAddon children={t('emails.form.appeal.addon')} />
            </InputGroup>
          </FormField>

          <FormField label={t('emails.form.body.label')}>
            <Controller
              control={control}
              name="body"
              render={({ field }) => <ReactQuill {...field} />}
            />
          </FormField>

          <Flex justify="flex-end" py="2" w="100%">
            <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
              {tc('actions.submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </>
  );
}

function EmailPreview({ email, imageUrl }) {
  if (!email) {
    return null;
  }

  const { appeal, body, subject } = email;

  return (
    <Html>
      <Head />
      <Body>
        <Container>
          {imageUrl && <Img src={imageUrl} alt={subject} width="400" />}
          <EmHeading>{subject}</EmHeading>
          <EmText>{`${appeal} [username]`}</EmText>
          <EmText>{body && renderHTML(body)}</EmText>
        </Container>
      </Body>
    </Html>
  );
}

export default EmailNewsletter;
