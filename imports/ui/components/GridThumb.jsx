import React from 'react';
import { Box, Heading, Flex, Image, Tag, Text, Center } from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import moment from 'moment';
moment.locale(i18n.language);

import NiceSlider from './NiceSlider';

export default function GridThumb({ resource }) {
  // const [t] = useTranslation('resources');

  if (!resource) {
    return null;
  }

  return (
    <Box bg="white" mb="2" px="4" py="4" key={resource?.label}>
      <Flex justifyContent="space-between" alignItems="flex-start" mb="4">
        <Heading size="md" fontWeight="bold">
          {resource.isCombo ? (
            <ResourcesForCombo resource={resource} />
          ) : (
            resource?.label
          )}
        </Heading>
      </Flex>

      {resource?.images && (
        <Box mb="4">
          {resource.images.length === 1 ? (
            <Center>
              <Image src={resource.images[0]} fit="contain" fill />
            </Center>
          ) : (
            <NiceSlider images={resource.images} />
          )}
        </Box>
      )}
      <Box>
        <Box className="text-content" mb="4">
          {resource.description && renderHTML(resource.description)}
        </Box>
        <Text as="p" fontSize="xs">
          {moment(resource.createdAt).format('D MMM YYYY')}
        </Text>
      </Box>
    </Box>
  );
}

function ResourcesForCombo({ resource }) {
  const [t] = useTranslation('resources');
  const resourcesForCombo = resource?.resourcesForCombo;
  const length = resource?.resourcesForCombo.length;

  return (
    <span>
      <Flex mb="2">
        <Text mr="2">{resource?.label}</Text>
        <Tag size="sm" textTransform="uppercase">
          {t('cards.ifCombo')}
        </Tag>
      </Flex>
      {' ['}
      {resourcesForCombo.map((res, i) => (
        <Text as="span" fontSize="sm" key={res._id}>
          {res.label + (i < length - 1 ? ' + ' : '')}
        </Text>
      ))}
      ]
    </span>
  );
}
