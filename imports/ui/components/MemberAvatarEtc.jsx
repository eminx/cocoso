import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  Tooltip,
  Wrap,
  WrapItem,
  useDisclosure,
} from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { BadgeCheck, Bolt } from 'lucide-react';

import { getFullName } from '../utils/shared';
import { StateContext } from '../LayoutContainer';
import Popover from '../components/Popover';
import { useTranslation } from 'react-i18next';

const tagProps = {
  bg: 'white',
  borderRadius: '0',
  border: '1px solid',
  borderColor: 'brand.500',
};

function MemberAvatarEtc({ centerItems = false, isThumb = false, hideRole = false, user }) {
  const [avatarModal, setAvatarModal] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentHost, isDesktop } = useContext(StateContext);
  const history = useHistory();
  const [t] = useTranslation('members');

  if (!user) {
    return null;
  }

  if (redirect) {
    if (redirect.host === currentHost.host) {
      history.push(`/@${user.username}`);
    } else {
      window.location.href = `https://${redirect.host}/@${user.username}`;
    }
  }

  const { avatar, memberships } = user;
  const avatarSrc = avatar?.src || avatar;

  const membershipsLength = memberships?.length;

  const role = memberships?.find((m) => m?.host === currentHost?.host)?.role;
  const roleTr = t(`roles.${role}`);

  const isCentered = !isDesktop || centerItems;

  return (
    <Box w="100%">
      <Flex align={isCentered ? 'center' : 'flex-start'} flexDirection="column" overflow="hidden">
        {avatarSrc ? (
          <Box {...(!isThumb && tagProps)}>
            <Image
              cursor={isThumb ? 'normal' : 'pointer'}
              fit="contain"
              h={isThumb ? 'auto' : '280px'}
              src={avatarSrc}
              onClick={!isThumb ? () => setAvatarModal(true) : null}
            />
          </Box>
        ) : (
          <Box p="4" pb="0">
            <Avatar borderRadius="0" name={user.username} size="2xl" />
          </Box>
        )}

        <Box pt="2" textAlign={isCentered ? 'center' : 'left'}>
          <Center>
            <HStack spacing="0.5">
              <Text fontWeight="bold" fontSize="xl">
                {user.username}
                {/* {!hideRole && role && ( */}
                {/* )} */}
              </Text>
              {['contributor', 'admin'].includes(role) && (
                <Box ml="1">
                  <Popover trigger={<BadgeCheck color="#010101" size="20" />}>
                    <Text fontWeight="bold">{t('roles.verified')}</Text>
                  </Popover>
                </Box>
              )}
              {role === 'admin' && (
                <Box>
                  <Popover trigger={<Bolt color="#010101" size="20" />}>
                    <Text fontWeight="bold">{t('roles.admin')}</Text>
                  </Popover>
                </Box>
              )}
            </HStack>
          </Center>
          <Box>
            <Text>{getFullName(user)}</Text>
          </Box>

          <Wrap justify="center" py="4" px={!isThumb && isDesktop ? '0' : '2'}>
            {user.keywords?.map((k) => (
              <WrapItem key={k.keywordId}>
                <Tag {...tagProps}>{k.keywordLabel}</Tag>
              </WrapItem>
            ))}
          </Wrap>

          {!isThumb && (
            <Box my="2">
              {membershipsLength > 1 && (
                <Popover
                  trigger={
                    <Button
                      colorScheme="gray.700"
                      fontWeight="light"
                      textDecoration="underline"
                      variant="link"
                    >
                      {t('profile.message.memberships', { count: membershipsLength })}
                    </Button>
                  }
                >
                  <Box p="1">
                    {memberships?.map((m) => (
                      <Box key={m.host} my="2" textAlign="left">
                        <Button
                          colorScheme="gray.800"
                          textAlign="left"
                          textDecoration="underline"
                          variant="link"
                          onClick={() => setRedirect(m)}
                        >
                          {m.hostname}
                        </Button>
                        <Text
                          as="span"
                          fontSize="sm"
                          fontWeight="light"
                          ml="2"
                          textAlign="left"
                          textTransform="lowercase"
                        >
                          {t(`roles.${m.role}`)}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </Popover>
              )}
            </Box>
          )}
        </Box>
      </Flex>

      {!isThumb && (
        <Modal isOpen={isOpen} onClose={onClose} onOpen={onOpen} size="sm" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{getFullName(user)}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box className="text-content" margin={{ bottom: 'medium' }}>
                {user.contactInfo
                  ? renderHTML(user.contactInfo)
                  : t('message.contact.empty', { username: user.username })}
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {avatarSrc && (
        <Modal
          isOpen={avatarModal}
          onClose={() => setAvatarModal(false)}
          onOpen={() => setAvatarModal(false)}
          size="xs"
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <Image src={avatarSrc} alt={user.username} fit="contain" />
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}

export default MemberAvatarEtc;
