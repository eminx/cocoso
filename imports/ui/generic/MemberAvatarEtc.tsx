import React from 'react';
import { Trans } from 'react-i18next';
import Bolt from 'lucide-react/dist/esm/icons/bolt';
import CircleCheckBig from 'lucide-react/dist/esm/icons/circle-check-big';
import { Tooltip } from 'react-tooltip';

import { Avatar, Box, Center, Flex, Tag, Text } from '/imports/ui/core';
import { getImageUrl } from '/imports/ui/utils/imageHelper';
import { getFullName } from '/imports/api/_utils/shared';

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
  [key: string]: any;
}

interface User {
  username?: string;
  avatar?: UserAvatar;
  keywords?: UserKeyword[];
  firstName?: string;
  lastName?: string;
  currentRole?: 'admin' | 'contributor' | 'participant';
}

export interface MemberAvatarEtcProps {
  isThumb?: boolean;
  user?: User | null;
}

export default function MemberAvatarEtc({
  isThumb = true,
  user,
}: MemberAvatarEtcProps) {
  if (!user) return null;

  const avatarSrc = user.avatar
    ? getImageUrl(user.avatar.src, isThumb ? 'small' : 'full')
    : undefined;

  const currentRole = user?.currentRole;

  return (
    <Box mb="6">
      <Center mb="2">
        <Avatar
          name={user?.username}
          size={!avatarSrc || isThumb ? '4xl' : '6xl'}
          src={avatarSrc}
        />
      </Center>

      <Box>
        <Center>
          <Flex spacing="0.5">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              {user.username}
              <a
                data-tooltip-id={`role-tooltip-${user._id}`}
                style={{ marginLeft: '0.3rem' }}
              >
                {currentRole === 'admin' && <Bolt color="#010101" size={20} />}
                {currentRole === 'contributor' && (
                  <CircleCheckBig color="#010101" size={20} />
                )}
              </a>
              <Tooltip
                content={
                  <Trans i18nKey={`members:roles.${currentRole}`}>
                    {currentRole}
                  </Trans>
                }
                id={`role-tooltip-${user._id}`}
                place="right"
                style={{ fontSize: '0.8rem' }}
              />
            </Text>
          </Flex>
        </Center>
        <Center mb="4">
          <Text textAlign="center">{getFullName(user)}</Text>
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
