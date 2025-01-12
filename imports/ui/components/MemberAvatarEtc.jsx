import React from 'react';
import { Avatar, Box, Center, Flex, Tag, Text, Wrap, WrapItem } from '@chakra-ui/react';
import parseHtml from 'html-react-parser';

import { getFullName } from '../utils/shared';

const tagProps = {
  bg: 'white',
  borderRadius: '0',
  border: '1px solid',
  borderColor: 'brand.500',
};

function MemberAvatarEtc({ isThumb = true, user }) {
  const { avatar, memberships } = user;
  const avatarSrc = avatar?.src || avatar;

  return (
    <Box mb="8">
      <Center>
        <Avatar
          borderRadius="8px"
          maxW={350}
          name={user.username}
          showBorder
          size={!avatarSrc || isThumb ? '2xl' : '4xl'}
          src={avatarSrc}
        />
      </Center>

      <Box>
        <Center>
          <Text fontWeight="bold" fontSize="xl">
            {user.username}
          </Text>
        </Center>
        <Center mb="4">
          <Text>{getFullName(user)}</Text>
        </Center>

        {!isThumb && user.keywords && (
          <Wrap justify="center" py="2">
            {user.keywords?.map((k) => (
              <WrapItem key={k.keywordId}>
                <Tag {...tagProps}>{k.keywordLabel}</Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}

        {!isThumb && user.bio && (
          <Center py="4">
            <Box
              borderLeft="3px solid"
              borderLeftColor="brand.100"
              className="text-content"
              maxW={300}
              pl="4"
            >
              {parseHtml(user.bio)}
            </Box>{' '}
          </Center>
        )}
      </Box>
    </Box>
  );
}

export default MemberAvatarEtc;
