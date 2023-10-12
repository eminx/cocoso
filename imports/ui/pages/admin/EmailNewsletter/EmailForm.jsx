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

          <FormField label={t('newsletter.labels.insertcontent')} mt="4">
            <Text color="gray.600" fontSize="sm">
              {t('newsletter.contenthelper')}
            </Text>
            <ContentInserter currentHost={currentHost} onSelect={onSelectItems} />
          </FormField>

          <FormField label={t('emails.form.footer.label')}>
            <Controller
              control={control}
              name="footer"
              render={({ field }) => <ReactQuill {...field} />}
            />
          </FormField>

          <Flex justify="flex-end" py="2" w="100%">
            <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
              {tc('actions.preview')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </>
  );
}
