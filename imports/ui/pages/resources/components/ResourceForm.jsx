import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Text,
  VStack,
  Wrap,
  IconButton,
  WrapItem,
} from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import ReactQuill from 'react-quill';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import { editorFormats, editorModules } from '../../../@/constants/quillConfig';
import { call, resizeImage, uploadImage } from '../../../@/shared';
import { message } from '../../../components/message';
import FormField from '../../../components/FormField';
import FileDropper from '../../../components/FileDropper';
import NiceSlider from '../../../components/NiceSlider';
import Loader from '../../../components/Loader';

const animatedComponents = makeAnimated();

function ResourceForm({ defaultValues, isEditMode, history }) {
  const [isLoading, setIsLoading] = useState(true);
  const [resourceLabels, setResourceLabels] = useState([]);
  const [resourcesForCombo, setResourcesForCombo] = useState([]);
  const [images, setImages] = useState(
    defaultValues?.images ? defaultValues.images : []
  );

  const { formState, handleSubmit, getValues, register, control } = useForm({
    defaultValues,
  });
  const { isDirty, isSubmitting } = formState;
  const isCombo = getValues('isCombo');

  const [t] = useTranslation('resources');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getResourceLabels();
    setResourcesForCombo(
      defaultValues?.resourcesForCombo.map((item) => ({
        value: item._id,
        label: item.label,
      }))
    );
  }, []);

  const getResourceLabels = async () => {
    try {
      const response = await call('getResourceLabels');
      setResourceLabels(
        response.map((item) => ({ value: item._id, label: item.label }))
      );
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
    }
  };

  const handleUploadImage = async () => {
    try {
      const imagesReadyToSave = await Promise.all(
        images.map(async (image) => {
          if (image.type === 'not-uploaded') {
            const resizedImage = await resizeImage(image.resizableData, 1200);
            const uploadedImageUrl = await uploadImage(
              resizedImage,
              'processDocumentUpload'
            );
            return uploadedImageUrl;
          } else {
            return image;
          }
        })
      );
      return imagesReadyToSave;
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
    }
  };

  const onSubmit = async (values) => {
    if (resourcesForCombo.length == 0) values.isCombo = false; // if isCombo checked but no resource selected
    values.resourcesForCombo = resourcesForCombo.map((item) => item.value);
    if (values.images !== []) values.images = await handleUploadImage();
    try {
      if (isEditMode) {
        await call('updateResource', defaultValues._id, values);
        message.success(
          tc('message.success.update', { domain: tc('domains.resource') })
        );
        history.push('/resources/' + defaultValues._id);
      } else {
        const newResource = await call('createResource', values);
        message.success(
          tc('message.success.create', { domain: tc('domains.resource') })
        );
        if (newResource) {
          history.push('/resources/' + newResource);
        }
      }
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleAutoCompleteSelectChange = (newValue, actionMeta) => {
    setResourcesForCombo(newValue);
  };

  const handleRemoveImage = (imageIndex) => {
    setImages(images.filter((image, index) => imageIndex !== index));
  };

  const handleSortImages = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) return;
    setImages(arrayMove(images, oldIndex, newIndex));
  };

  const setFileDropperImage = (files) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener(
        'load',
        () => {
          setImages((images) => [
            ...images,
            {
              resizableData: file,
              type: 'not-uploaded',
              src: reader.result,
            },
          ]);
        },
        false
      );
    });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="6">
          <FormControl display="flex" alignItems="center">
            <Switch
              {...register('isCombo')}
              isDisabled={isEditMode}
              id="is-combo-switch"
            />
            <FormLabel htmlFor="is-combo-switch" mb="0" ml="4">
              {t('form.combo.switch.label')}
            </FormLabel>
          </FormControl>

          {isCombo && (
            <Box bg="gray.100" p="6" w="90%">
              <Text fontSize="sm" mb="6">
                {t('form.combo.select.helper')}
              </Text>
              {isLoading ? (
                <Loader />
              ) : (
                <AutoCompleteSelect
                  onChange={handleAutoCompleteSelectChange}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  defaultValue={resourcesForCombo}
                  options={resourceLabels}
                  style={{ width: '100%', marginTop: '1rem' }}
                />
              )}
            </Box>
          )}

          <FormField label={t('form.name.label')}>
            <Input
              {...register('label')}
              placeholder={t('form.name.holder')}
            />
          </FormField>

          <FormField label={t('form.desc.label')}>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  formats={editorFormats}
                  modules={editorModules}
                  placeholder={t('form.desc.holder')}
                />
              )}
            />
          </FormField>

          <FormField label={t('form.images.label', { count: images.length })}>
            <Box>
              {images && (
                <>
                  <NiceSlider
                    images={images.map((image) =>
                      image.src ? image.src : image
                    )}
                  />
                  <SortableContainer
                    onSortEnd={handleSortImages}
                    axis="xy"
                    helperClass="sortableHelper"
                  >
                    {images.map((image, index) => (
                      <SortableItem
                        key={'sortable_img_' + index}
                        index={index}
                        image={image.src ? image.src : image}
                        onRemoveImage={() => handleRemoveImage(index)}
                      />
                    ))}
                  </SortableContainer>
                </>
              )}
              <Center w="100%">
                <FileDropper setUploadableImage={setFileDropperImage} />
              </Center>
            </Box>
          </FormField>

          <Flex justify="flex-end" py="4" w="100%">
            <Button
              isDisabled={!isDirty}
              isLoading={isSubmitting}
              type="submit"
            >
              {tc('actions.submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
}

const thumbStyle = (backgroundImage) => ({
  backgroundImage: backgroundImage && `url('${backgroundImage}')`,
});

const SortableItem = sortableElement(({ image, onRemoveImage, index }) => {
  return (
    <WrapItem key={image} className="sortable-thumb" style={thumbStyle(image)}>
      <IconButton
        className="sortable-thumb-icon"
        colorScheme="gray.900"
        icon={<SmallCloseIcon style={{ pointerEvents: 'none' }} />}
        size="xs"
        onClick={onRemoveImage}
        style={{ position: 'absolute', top: 4, right: 4 }}
      />
    </WrapItem>
  );
});

const SortableContainer = sortableContainer(({ children }) => (
  <Wrap py="2">{children}</Wrap>
));

export default ResourceForm;
