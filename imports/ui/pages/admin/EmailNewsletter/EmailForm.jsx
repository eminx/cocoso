import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import FormField from '../../../components/FormField';
import ReactQuill from '../../../components/Quill';
import FileDropper from '../../../components/FileDropper';
import ContentInserter from './ContentInserter';

export default function EmailForm({
  currentHost,
  email,
  onChange,
  onSelectItems,
  onSubmit,
  setUploadableImage,
}) {
  const { control, handleSubmit, register, formState, reset } = useForm({
    email,
  });
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const { isDirty, isSubmitting } = formState;

  const { appeal, body, image, items, subject } = email;
  const { imageUrl, uploadableImageLocal } = image;

  const isButtonDisabled =
    !appeal || !subject || ((!body || body.length < 3) && !image && items.length === 0);

  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <>
      <form onSubmit={handleSubmit((data) => onSubmit())}>
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

          <FormField label={t('emails.form.subject.label')} isRequired>
            <Input
              placeholder={t('emails.form.subject.holder')}
              value={email.subject}
              onChange={(event) => handleChange('subject', event.target.value)}
            />
          </FormField>

          <FormField label={t('emails.form.appeal.label')} isRequired>
            <InputGroup w="280px">
              <Input
                placeholder={t('emails.form.appeal.holder')}
                value={email.appeal}
                onChange={(event) => handleChange('appeal', event.target.value)}
              />
              <InputRightAddon children={t('emails.form.appeal.addon')} />
            </InputGroup>
          </FormField>

          <FormField label={t('emails.form.body.label')}>
            <ReactQuill value={email.body} onChange={(value) => handleChange('body', value)} />
          </FormField>

          <FormField label={t('newsletter.labels.insertcontent')} mt="4">
            <Text color="gray.600" fontSize="sm">
              {t('newsletter.contenthelper')}
            </Text>
            <ContentInserter currentHost={currentHost} onSelect={onSelectItems} />
          </FormField>

          <FormField label={t('emails.form.footer.label')}>
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
        </VStack>
      </form>
    </>
  );
}
