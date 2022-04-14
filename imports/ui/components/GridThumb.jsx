import React from 'react';
import { Box, Heading, Flex, Image, Text, Center } from '@chakra-ui/react';
import i18n from 'i18next';
import moment from 'moment';
moment.locale(i18n.language);

import ResourcesForCombo from './ResourcesForCombo';

export default function GridThumb({ girdItem, itemType }) {
  if (!girdItem) {
    return null;
  }

  return (
    <Box bg="white" mb="2" px="4" py="4" key={girdItem?.label}>
      <Flex justifyContent="space-between" alignItems="flex-start" mb="4">
        <Heading size="md" fontWeight="bold">
          {itemType === 'resource' && girdItem.isCombo ? (
            <ResourcesForCombo resource={girdItem} />
          ) : (
            girdItem?.label
          )}
        </Heading>
      </Flex>
      {girdItem?.images && (
        <Box mb="4">
          <Center>
            <Image src={girdItem.images[0]} fit="contain" fill />
          </Center>
        </Box>
      )}
      {girdItem?.image && (
        <Box mb="4">
          <Center>
            <Image src={girdItem.Image} fit="contain" fill />
          </Center>
        </Box>
      )}
      <Box>
        <Text as="p" fontSize="xs">
          {moment(girdItem.createdAt).format('D MMM YYYY')}
        </Text>
      </Box>
    </Box>
  );
}
