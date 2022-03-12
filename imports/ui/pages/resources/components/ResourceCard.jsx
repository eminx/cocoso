import React from 'react';
import { Box, Heading, Flex, Tag, Text } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import moment from 'moment';
moment.locale(i18n.language);

export default function ResourcesCard({ resource }) {
  const [ t ] = useTranslation('admin');
  return (
    <Box bg="white" mb="2" p="2" key={resource?.label}>
      <Heading size="md" fontWeight="bold">
        {resource?.isCombo ? (
          <ResourcesForCombo resource={resource} />
        ) : (
          resource?.label
        )}
      </Heading>
      <Text as="div" my="2">
        {resource && resource?.description}
      </Text>
      <Box py="2">
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