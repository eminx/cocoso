import React from 'react';
import {
  Box,
  Heading,
  Flex,
  Image,
  Text,
  AspectRatio,
  Spacer,
} from '@chakra-ui/react';
import i18n from 'i18next';
import moment from 'moment';
moment.locale(i18n.language);

import ResourcesForCombo from './ResourcesForCombo';

export default function GridThumb({ girdItem, itemType }) {
  if (!girdItem) {
    return null;
  }

  const thumbHasImage =
    (girdItem?.image && girdItem.image !== '') ||
    (girdItem?.images && girdItem?.images.length > 0);

  return (
    <Flex bg="white" mb="2" p="4" key={girdItem?._id} h="100%">
      {thumbHasImage && (
        <Box style={{ marginRight: '1rem', width: 'calc(50% - 1rem)' }}>
          <AspectRatio maxW="480px" ratio={16 / 9}>
            <Image
              src={girdItem?.image ? girdItem.image : girdItem.images[0]}
              objectFit="cover"
            />
          </AspectRatio>
        </Box>
      )}
      <Flex w={thumbHasImage ? '50%' : '100%'} direction="column">
        <Heading size="md" fontWeight="bold">
          {itemType === 'resource' && girdItem.isCombo ? (
            <ResourcesForCombo resource={girdItem} />
          ) : (
            girdItem?.label
          )}
        </Heading>
        <Spacer my="4" />
        <Text as="p" fontSize="xs" alignSelf="flex-end">
          {moment(girdItem.createdAt).format('D MMM YYYY')}
        </Text>
      </Flex>
    </Flex>
  );
}
