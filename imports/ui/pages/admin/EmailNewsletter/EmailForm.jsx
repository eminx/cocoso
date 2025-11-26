import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import AddIcon from 'lucide-react/dist/esm/icons/plus';

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  Text,
} from '/imports/ui/core';
import FormField from '/imports/ui/forms/FormField';
import Quill from '/imports/ui/forms/Quill';
import FileDropper from '/imports/ui/forms/FileDropper';
import ImageUploader from '/imports/ui/forms/ImageUploader';
import Menu from '/imports/ui/generic/Menu';

import ContentInserter from './ContentInserter';
import { newsletterAtom } from './index';
import { contentTypes } from './constants';

function BodyContentHandler({ content }) {
  const [state, setState] = useAtom(newsletterAtom);

  if (!content) {
    return null;
  }
  const { email } = state;
  const { type, value } = content;

  const handleUploadedImage = (images) => {
    if (!images || images.length < 1) {
      return;
    }

    const updatedEmailBody = email.body?.map((cont) => {
      if (cont.id === content.id) {
        return {
          ...cont,
          value: {
            src: images[0],
          },
        };
      }
      return cont;
    });

    setState((prevState) => ({
      ...state,
      email: {
        ...state.email,
        body: updatedEmailBody,
      },
    }));
  };

  const handleChangeText = (value) => {
    if (!value) {
      return;
    }

    const updatedEmailBody = email.body.map((cont) => {
      if (cont.id === content.id) {
        return {
          ...cont,
          value: {
            html: value,
          },
        };
      }
      return cont;
    });

    setState((prevState) => ({
      ...prevState,
      email: {
        ...prevState.email,
        body: updatedEmailBody,
      },
    }));
  };

  const renderContent = () => {
    if (type === 'divider') {
      return <Divider />;
    }

    if (type === 'image') {
      return (
        <ImageUploader
          isMultiple={false}
          ping={state.uploadingImages}
          preExistingImages={value.src ? [value.src] : []}
          onUploadedImages={handleUploadedImage}
        />
      );
    }

    if (type === 'text') {
      return <Quill value={value.html} onChange={handleChangeText} />;
    }
  };

  return (
    <FormField
      helperText={<Trans i18nKey={`admin:newsletter.form.${type}.helper`} />}
      label={<Trans i18nKey={`admin:newsletter.form.${type}.label`} />}
      mb="4"
    >
      {renderContent()}
    </FormField>
  );
}

export default function EmailForm({ currentHost, onSubmit }) {
  const [state, setState] = useAtom(newsletterAtom);
  const { email } = state;
  const { handleSubmit } = useForm({
    email,
  });
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const { appeal, body, items, subject } = email;

  const handleChange = (field, value) => {
    const newEmail = {
      ...state.email,
    };
    newEmail[field] = value;
    setState((prevState) => ({
      ...prevState,
      email: newEmail,
    }));
  };

  const handleAddContent = (content) => {
    const newContent = {
      ...content,
      id: Date.now().toString(),
    };

    setState((prevState) => ({
      ...prevState,
      email: {
        ...prevState.email,
        body: [...prevState.email.body, newContent],
      },
    }));
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

  const isButtonDisabled =
    !subject || ((!body || body.length < 1) && (!items || items.length < 1));

  return (
    <>
      <form onSubmit={handleSubmit((data) => onSubmit())}>
        <Flex direction="column" gap="4">
          <FormField
            helperText={t('newsletter.form.subject.helper')}
            required
            label={t('emails.form.subject.label')}
            mb="4"
          >
            <Input
              placeholder={t('emails.form.subject.holder')}
              value={email.subject}
              onChange={(event) => handleChange('subject', event.target.value)}
            />
          </FormField>

          <FormField
            helperText={t('newsletter.form.appeal.helper')}
            label={t('emails.form.appeal.label')}
            mb="4"
          >
            <Flex align="center" w="280px">
              <Input
                placeholder={t('emails.form.appeal.holder')}
                value={email.appeal}
                onChange={(event) => handleChange('appeal', event.target.value)}
              />
              <Text>{t('emails.form.appeal.addon')}</Text>
            </Flex>
          </FormField>

          {body?.map((content) => (
            <BodyContentHandler key={content.id} content={content} />
          ))}

          <Center p="4">
            <Menu
              buttonLabel={<Trans i18nKey="admin:composable.form.addContent" />}
              leftIcon={<AddIcon size="18px" />}
              options={contentTypes.map((content) => ({
                ...content,
                key: content.type,
              }))}
              onSelect={handleAddContent}
            >
              {(item) => (
                <Trans i18nKey={`admin:composable.form.types.${item.type}`} />
              )}
            </Menu>
          </Center>

          {/* <FormField
            helperText={
              uploadableImageLocal || imageUrl
                ? tc('plugins.fileDropper.replace')
                : t('newsletter.form.image.helper')
            }
            label={t('emails.form.image.label')}
            mb="4"
          >
            <Center>
              <FileDropper
                imageUrl={imageUrl}
                setUploadableImage={setUploadableImage}
                uploadableImageLocal={uploadableImageLocal}
              />
            </Center>
          </FormField>

          <FormField
            helperText={t('newsletter.form.body.helper')}
            label={t('emails.form.body.label')}
            mb="4"
          >
            <Quill
              value={email.body}
              onChange={(value) => onChange('body', value)}
            />
          </FormField> */}

          <Box mb="24">
            <ContentInserter onSelect={handleSelectItems} />
          </Box>

          <FormField label={t('emails.form.footer.label')} mb="4">
            <Quill
              className="ql-editor-text-align-center"
              value={email.footer}
              onChange={(value) => onChange('footer', value)}
            />
          </FormField>

          <Flex justify="flex-end" py="2" w="100%">
            <Button isDisabled={isButtonDisabled} type="submit">
              {tc('actions.preview')}
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
}
