import React from 'react';
import { useTranslation } from 'react-i18next';

import { Avatar, Box, Center, Flex, Tag, Text } from '/imports/ui/core';

import { getFullName } from '../../api/_utils/shared';

const tagProps = {
  bg: 'white',
  border: '1px solid',
  borderColor: 'theme.500',
};

interface UserKeyword {
  keywordId: string;
  keywordLabel: string;
}

interface UserAvatar {
  src?: string;
  date?: Date;
}

interface User {
  username?: string;
  avatar?: UserAvatar | string;
  keywords?: UserKeyword[];
  firstName?: string;
  lastName?: string;
}

export interface MemberAvatarEtcProps {
  isThumb?: boolean;
  user?: User | null;
  role?: string;
}

export default function MemberAvatarEtc({
  isThumb = true,
  user,
  role,
}: MemberAvatarEtcProps) {
  if (!user) return null;

  const avatarSrc =
    typeof user.avatar === 'object' ? user.avatar?.src : user.avatar;
  const [t] = useTranslation('members');

  return (
    <Box mb="6">
      <Center mb="2">
        <Avatar
          name={user?.username}
          size={!avatarSrc || isThumb ? '2xl' : '6xl'}
          src={avatarSrc}
        />
      </Center>

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

      <Box>
        <Center>
          <Flex spacing="0.5">
            <Text fontWeight="bold" fontSize="xl">
              {user.username}
            </Text>
          </Flex>
        </Center>
        <Center mb="4">
          <Text>{getFullName(user)}</Text>
        </Center>

        {!isThumb && user.keywords && (
          <Flex justify="center" py="2" wrap="wrap">
            {user.keywords?.map((k) => (
              <Box key={k.keywordId}>
                <Tag {...tagProps}>{k.keywordLabel}</Tag>
              </Box>
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  );
}
