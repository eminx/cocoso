import React from 'react';
import { Box, Heading, Flex, Tag, Text, Image } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import moment from 'moment';
moment.locale(i18n.language);

export default function ResourcesCard({ resource }) {
  const [ t ] = useTranslation('admin');
  return (
    <Box bg="white" mb="2" px="2" py="4" key={resource?.label}>
      <Heading size="md" fontWeight="bold" mb="4">
        {resource?.isCombo ? (
          <ResourcesForCombo resource={resource} />
        ) : (
          resource?.label
        )}
      </Heading>
      {resource?.imageUrl && 
        <Box mb="4">
          <Image src={resource?.imageUrl} fit="contain" fill />
        </Box>
      }
      <Text as="div" mb="4">
        {resource && resource?.description}
      </Text>
      <Box>
        <Text as="div" fontSize="xs">
          {t('resources.cards.date', { 
            username: resource && resource?.createdBy, 
            date: moment(resource?.createdAt).format('D MMM YYYY')
          })}
          <br />
        </Text>
      </Box>
    </Box>
  );
}

function ResourcesForCombo({ resource }) {
  const [ t ] = useTranslation('admin');
  const resourcesForCombo = resource?.resourcesForCombo;
  const length = resource?.resourcesForCombo.length;

  return (
    <span>
      <Flex mb="2">
        <Text mr="2">{resource?.label}</Text>
        <Tag size="sm" textTransform="uppercase">{t('resources.cards.ifCombo')}</Tag>
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