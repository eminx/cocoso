import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import TrashIcon from 'lucide-react/dist/esm/icons/trash';

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  IconButton,
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

const getDefaultFooter = (currentHost) => {
  if (!currentHost) {
    return null;
  }

  const { host, settings } = currentHost;
  const address = `${settings.address}, ${settings.city}, ${settings.country}`;

  return `
    <h1 style="margin-bottom: 24px;">${settings?.name}</h1>
    <br />
    <p>${address}</p>
    <p>
      <a href="mailto:${settings?.email}">
        ${settings?.email}
      </a>
    </p>
    <p>
      <a href="https://${host}">
        ${host}
      </a>
    </p>
  `;
};

function BodyContentHandler({ content }) {
  const [state, setState] = useAtom(newsletterAtom);

  if (!content) {
    return null;
  }
  const { email } = state;
  const { type, value } = content;

  const handleUploadedImage = (images) => {
    console.log('image uploaded:', images?.[0]);
    if (!images || images.length < 1) {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      email: {
        ...prevState.email,
        body: prevState.email.body?.map((cont) => {
          if (cont.id === content.id) {
            return {
              ...cont,
              value: {
                src: images[0],
              },
            };
          }
          return cont;
        }),
      },
    }));
  };

  const handleChangeText = (value) => {
    if (!value) {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      email: {
        ...prevState.email,
        body: prevState.email.body.map((cont) => {
          if (cont.id === content.id) {
            return {
              ...cont,
              value: {
                html: value,
              },
            };
          }
          return cont;
        }),
      },
    }));
  };

  const handleRemove = () => {
    setState((prevState) => ({
      ...prevState,
      email: {
        ...prevState.email,
        body: prevState.email.body.filter((cont) => cont.id !== content.id),
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
    <Box
      bg="white"
      px="4"
      w="100%"
      css={{
        borderRadius: '12px',
        position: 'relative',
      }}
    >
      <IconButton
        colorScheme="red"
        icon={<TrashIcon size="16px" />}
        size="xs"
        variant="ghost"
        type="button"
        css={{
          flexGrow: '0',
          position: 'absolute',
          top: '12px',
          right: '12px',
        }}
        onClick={handleRemove}
      />
      <FormField
        label={<Trans i18nKey={`admin:newsletter.form.${type}.label`} />}
      >
        {renderContent()}
      </FormField>
    </Box>
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

  useEffect(() => {
    if (!currentHost) {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      email: {
        ...prevState.email,
        footer: getDefaultFooter(currentHost),
      },
    }));
  }, [currentHost]);

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
    setState((prevState) => ({
      ...prevState,
      email: {
        ...prevState.email,
        body: [
          ...prevState.email.body,
          {
            ...content,
            id: Date.now().toString(),
          },
        ],
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

          <Box mb="24">
            <ContentInserter onSelect={handleSelectItems} />
          </Box>

          <FormField label={t('emails.form.footer.label')} mb="4">
            <Quill
              className="ql-editor-text-align-center"
              value={email.footer}
              onChange={(value) => handleChange('footer', value)}
            />
          </FormField>

          <Flex justify="flex-end" py="2" w="100%">
            <Button
              disabled={isButtonDisabled}
              loading={state.uploadingImages}
              type="submit"
            >
              {tc('actions.preview')}
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
}
