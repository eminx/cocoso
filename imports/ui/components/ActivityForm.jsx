import React, { useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Input,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';

import DatesAndTimes from './DatesAndTimes';
import FormField from './FormField';
import ReactQuill from './Quill';
import { localeSort } from '../utils/shared';
import { StateContext } from '../LayoutContainer';
import NiceSlider from './NiceSlider';
import ImageUploadUI from './ImageUploadUI';
import { DocumentUploadHelper } from './UploadHelpers';

const defaultCapacity = 40;
const today = new Date().toISOString().substring(0, 10);

const emptyDateAndTime = {
  startDate: today,
  endDate: today,
  startTime: '00:00',
  endTime: '23:59',
  attendees: [],
  capacity: defaultCapacity,
};

function ActivityForm({
  datesAndTimes,
  defaultValues,
  images,
  isNew,
  isButtonDisabled,
  isPublicActivity,
  isSubmitting,
  resources,
  onRemoveImage,
  onSortImages,
  onSubmit,
  setDatesAndTimes,
  setUploadableImages,
  setSelectedResource,
}) {
  const { currentHost } = useContext(StateContext);
  useEffect(() => {
    setSelectedResource(getValues('resourceId'));
  }, [defaultValues]);

  const { control, formState, handleSubmit, getValues, register } = useForm({
    defaultValues,
  });

  const [tc] = useTranslation('common');
  const [t] = useTranslation('activities');

  const addRecurrence = () => {
    const newDatesAndTimes = [...datesAndTimes, { ...emptyDateAndTime }];

    setDatesAndTimes(newDatesAndTimes);
  };

  const removeOccurrence = (index) => {
    const newDatesAndTimes = datesAndTimes.filter((item, i) => {
      return i !== index;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  const handleDateTimeChange = (date, occurrenceIndex) => {
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (index === occurrenceIndex) {
        return date;
      } else {
        return item;
      }
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  const handleCapacityChange = (value, occurrenceIndex) => {
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (occurrenceIndex === index) {
        item.capacity = Number(value);
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  const handleRangeSwitch = (event, occurrenceIndex) => {
    const value = event.target.checked;
    const newDatesAndTimes = datesAndTimes.map((item, index) => {
      if (occurrenceIndex === index) {
        item.isRange = value;
        if (!value) {
          item.endDate = item.startDate;
        }
      }
      return item;
    });

    setDatesAndTimes(newDatesAndTimes);
  };

  const resourcesInMenu = currentHost?.settings?.menu?.find((item) => item.name === 'resources');

  return (
    <div data-oid="cv:zczq">
      <form onSubmit={handleSubmit((data) => onSubmit(data))} data-oid="uqt52x-">
        <Box mb="8" data-oid="-wms2ty">
          <FormField
            helperText={t('form.resource.helper')}
            label={
              <b data-oid=":5d._8u">
                {parseHtml(
                  t('form.resource.label', {
                    resources: resourcesInMenu?.label,
                  })
                )}
              </b>
            }
            data-oid="3b8bu9m"
          >
            <Select
              {...register('resourceId')}
              placeholder={t('form.resource.holder')}
              onChange={(e) => setSelectedResource(e.target.value)}
              data-oid="6dhf3p5"
            >
              {resources
                .sort(localeSort)
                .filter((r) => r.isBookable)
                .map((option, index) => (
                  <option
                    key={option._id}
                    selected={option._id === defaultValues.resourceId}
                    value={option._id}
                    data-oid="ebvjnt0"
                  >
                    {option.isCombo
                      ? `${option.label}: [${option.resourcesForCombo.map((res, i) => res.label)}]`
                      : option.label}
                  </option>
                ))}
            </Select>
          </FormField>
        </Box>

        <Box mb="8" data-oid="h11ty89">
          <FormField
            helperText={t('form.occurrences.helper')}
            label={<b data-oid="8elyr0n">{t('form.occurrences.label')}</b>}
            isRequired
            data-oid="mye0w6t"
          />

          <Box mb="4" mt="2" data-oid="gyl352n">
            {datesAndTimes.map((occurrence, index) => {
              const id =
                occurrence.startDate +
                occurrence.endDate +
                occurrence.startTime +
                occurrence.endTime +
                index;
              return (
                <DatesAndTimes
                  key={id}
                  id={id}
                  isPublicActivity={isPublicActivity}
                  occurrence={occurrence}
                  removeOccurrence={() => removeOccurrence(index)}
                  isDeletable={datesAndTimes.length > 1}
                  handleCapacityChange={(value) => handleCapacityChange(value, index)}
                  handleDateTimeChange={(date) => handleDateTimeChange(date, index)}
                  handleRangeSwitch={(event) => handleRangeSwitch(event, index)}
                  data-oid="j2_kog5"
                />
              );
            })}
            <Center bg="white" p="6" data-oid="c81jfid">
              <IconButton
                bg="gray.700"
                size="lg"
                onClick={addRecurrence}
                icon={<AddIcon data-oid="pjz3umc" />}
                data-oid="7quux.n"
              />
            </Center>
          </Box>
        </Box>

        <Box mb="8" data-oid="--rt5xo">
          <Heading mb="4" size="md" data-oid="2258m0p">
            {t('form.details.label')}
          </Heading>

          <VStack spacing="6" data-oid="2f_japx">
            <FormField
              helperText={t('form.title.helper')}
              label={t('form.title.label')}
              isRequired
              data-oid="vu:ocdv"
            >
              <Input
                {...register('title', { required: true })}
                placeholder={t('form.title.holder')}
                data-oid="b7gxfcd"
              />
            </FormField>

            {isPublicActivity && (
              <FormField
                helperText={t('form.subtitle.helper')}
                label={t('form.subtitle.label')}
                isRequired
                data-oid="kk9vqy3"
              >
                <Input
                  {...register('subTitle', { required: true })}
                  placeholder={t('form.subtitle.holder')}
                  data-oid="r-6zuy3"
                />
              </FormField>
            )}

            <FormField
              helperText={t('form.description.helper')}
              label={t('form.description.label')}
              isRequired={isPublicActivity}
              data-oid="qmkc98t"
            >
              <Controller
                control={control}
                name="longDescription"
                render={({ field }) => <ReactQuill {...field} data-oid="0kcwqo8" />}
                data-oid="ukmz2lz"
              />
            </FormField>

            {isPublicActivity && (
              <FormField
                helperText={t('form.place.helper')}
                label={t('form.place.label')}
                data-oid="-mtv2-6"
              >
                <Input
                  {...register('place')}
                  placeholder={t('form.place.holder')}
                  data-oid="bux8bbh"
                />
              </FormField>
            )}

            {isPublicActivity && (
              <FormField
                helperText={t('form.address.helper')}
                label={t('form.address.label')}
                data-oid="r1n16ls"
              >
                <Textarea
                  {...register('address')}
                  placeholder={t('form.address.holder')}
                  data-oid=".78dfwu"
                />
              </FormField>
            )}

            {isPublicActivity && (
              <FormField
                label={t('form.image.label', { count: images?.length || 0 })}
                helperText={t('form.image.helper')}
                isRequired
                data-oid="100prza"
              >
                {images && (
                  <Center mb="4" data-oid="lm2-42f">
                    <NiceSlider width="300px" images={images} data-oid="4:h4fxm" />
                  </Center>
                )}
                <ImageUploadUI
                  images={images}
                  onRemoveImage={onRemoveImage}
                  onSelectImages={setUploadableImages}
                  onSortImages={onSortImages}
                  data-oid="p6wl-ep"
                />

                <DocumentUploadHelper isImage data-oid="g7gcukx" />
              </FormField>
            )}
          </VStack>
        </Box>

        <Flex justify="flex-end" py="4" w="100%" data-oid="4tiew50">
          <Button
            isDisabled={isButtonDisabled}
            isLoading={isSubmitting}
            type="submit"
            data-oid="xmvqidz"
          >
            {tc('actions.submit')}
          </Button>
        </Flex>
      </form>
    </div>
  );
}

export default ActivityForm;
