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
    <Box mb="8" data-oid="nbdv3ud">
      <Center data-oid="707uj0u">
        <Avatar
          borderRadius="8px"
          maxW={350}
          name={user.username}
          showBorder
          size={!avatarSrc || isThumb ? '2xl' : '4xl'}
          src={avatarSrc}
          data-oid=".q1nacp"
        />
      </Center>

      <Box data-oid="s.8sn7-">
        <Center data-oid="ods:ycf">
          <Text fontWeight="bold" fontSize="xl" data-oid="qya6_2s">
            {user.username}
          </Text>
        </Center>
        <Center mb="4" data-oid="dmjfc.f">
          <Text data-oid="kayfu.c">{getFullName(user)}</Text>
        </Center>

        {!isThumb && user.keywords && (
          <Wrap justify="center" py="2" data-oid="bp_5023">
            {user.keywords?.map((k) => (
              <WrapItem key={k.keywordId} data-oid="lnpuomn">
                <Tag {...tagProps} data-oid="fvnoa78">
                  {k.keywordLabel}
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}

        {!isThumb && user.bio && (
          <Center py="4" data-oid="a9b1pk2">
            <Box
              borderLeft="3px solid"
              borderLeftColor="brand.100"
              className="text-content"
              maxW={300}
              pl="4"
              data-oid="9mqr_yj"
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
