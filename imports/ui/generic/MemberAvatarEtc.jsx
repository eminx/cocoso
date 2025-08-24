import React from 'react';
import { useTranslation } from 'react-i18next';
import CircleCheck from 'lucide-react/dist/esm/icons/circle-check';
import Bolt from 'lucide-react/dist/esm/icons/bolt';

import { Avatar, Box, Center, HStack, Tag, Text, Wrap } from '/imports/ui/core';

// import Popover from './Popover';
import { getFullName } from '../utils/shared';

const tagProps = {
  bg: 'white',
  border: '1px solid',
  borderColor: 'theme.500',
};

export default function MemberAvatarEtc({ isThumb = true, user, role }) {
  if (!user) return null;

  const avatarSrc = user?.avatar?.src || user?.avatar;
  const [t] = useTranslation('members');

  return (
    <Box mb="6">
      <Center>
        <Avatar
          name={user?.username}
          size={!avatarSrc || isThumb ? '2xl' : '6xl'}
          src={avatarSrc}
        />
      </Center>

      <Box>
        <Center>
          <HStack spacing="0.5">
            <Text fontWeight="bold" fontSize="xl">
              {user.username}
            </Text>
            {/* {['contributor', 'admin'].includes(role) && (
              <Box ml="1">
                <Popover
                  triggerComponent={
                    role === 'contributor' ? (
                      <CircleCheck color="#010101" size="20" />
                    ) : (
                      <Bolt color="#010101" size="20" />
                    )
                  }
                >
                  <Text fontWeight="bold">
                    {role === 'contributor'
                      ? t('roles.verified')
                      : t('roles.admin')}
                  </Text>
                </Popover>
              </Box>
            )} */}
          </HStack>
        </Center>
        <Center mb="4">
          <Text>{getFullName(user)}</Text>
        </Center>

        {!isThumb && user.keywords && (
          <Wrap justify="center" py="2">
            {user.keywords?.map((k) => (
              <Box key={k.keywordId}>
                <Tag {...tagProps}>{k.keywordLabel}</Tag>
              </Box>
            ))}
          </Wrap>
        )}
      </Box>
    </Box>
  );
}
