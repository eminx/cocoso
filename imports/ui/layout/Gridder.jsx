import React from 'react';
import { Helmet } from 'react-helmet';

import { Center, Flex, Heading, Image, Text } from '/imports/ui/core';

export default function Gridder({ items }) {
  if (!items) {
    return null;
  }

  const imageUrl =
    items.find((item) => item.imageUrl)?.imageUrl ||
    items.find((item) => {
      if (item.images) {
        return item.images[0];
      }
      return null;
    })?.images[0] ||
    null;

  return (
    <>
      <Helmet>
        <meta property="og:image" content={imageUrl} />
      </Helmet>

      <Center>
        <Flex justify="center" wrap="wrap">
          {items.map((item) => (
            <Flex
              direction="column"
              key={item._id}
              mb="4"
              css={{ width: '360px' }}
            >
              <Image
                w={360}
                h={240}
                src={
                  item.imageUrl || (item.images && item.images[0]) || item.logo
                }
              />
              <Heading fontSize={18}>
                {item.title || item.label || item.settings?.name}
              </Heading>
              <Text>{item._id}</Text>
            </Flex>
          ))}
        </Flex>
      </Center>
    </>
  );
}
