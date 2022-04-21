import React from 'react';
import { Badge, Box, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function ResourcesForCombo({ resource }) {
  const [t] = useTranslation('resources');
  const resourcesForCombo = resource?.resourcesForCombo;
  return (
    <Box my="2">
      <Badge p="1" my="1">
        {t('cards.ifCombo')}:
        <Flex pt="1" wrap="wrap">
          {resourcesForCombo.map((res, i) => (
            <Badge
              // fontWeight="normal"
              key={res._id}
              mr="1"
              mb="1"
              px="1"
              size="xs"
              textTransform="none"
              variant="solid"
            >
              {res.label}
              </Badge>
          ))}
          </Flex>
        </Badge>
      </Box>
  );
}
