import React from 'react';
import { Flex, Tag, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function ResourcesForCombo({ resource }) {
  const [t] = useTranslation('resources');
  const resourcesForCombo = resource?.resourcesForCombo;
  const length = resource?.resourcesForCombo.length;
  return (
    <div>
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
    </div>
  );
}
