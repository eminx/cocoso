import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Center, Flex, Input, Text } from '/imports/ui/core';
import FormField from '/imports/ui/forms/FormField';
import ReactQuill from '/imports/ui/forms/Quill';
import FileDropper from '/imports/ui/forms/FileDropper';

import ContentInserter from './ContentInserter';

export default function EmailForm({
  currentHost,
  email,
  onChange,
  onSelectItems,
  onSubmit,
  setUploadableImage,
}) {
  const { handleSubmit } = useForm({
    email,
  });
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const { appeal, body, image, items, subject } = email;
  const { imageUrl, uploadableImageLocal } = image;

  const isButtonDisabled =
    !appeal ||
    !subject ||
    ((!body || body.length < 3) &&
      (!image || !uploadableImageLocal) &&
      (!items || items.length === 0));

  const handleChange = (field, value) => {
    onChange(field, value);
  };

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
            required
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

          <FormField
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
            <ReactQuill
              value={email.body}
              onChange={(value) => handleChange('body', value)}
            />
          </FormField>

          {/* <ContentInserter currentHost={currentHost} onSelect={onSelectItems} /> */}

          <FormField label={t('emails.form.footer.label')} mb="4">
            <ReactQuill
              className="ql-editor-text-align-center"
              value={email.footer}
              onChange={(value) => handleChange('footer', value)}
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
