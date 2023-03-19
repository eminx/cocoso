import React, { useContext, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Code,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import renderHTML from 'react-render-html';

import { getFullName } from '../utils/shared';
import { StateContext } from '../LayoutContainer';
import Popover from '../components/Popover';

function MemberAvatarEtc({ t, tc, user }) {
  const [avatarModal, setAvatarModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isDesktop, role } = useContext(StateContext);
  if (!user) {
    return null;
  }

  const { avatar, memberships } = user;

  const membershipsLength = memberships.length;

  return (
    <>
      <Flex px="6" flexDirection="column" align={isDesktop ? 'flex-start' : 'center'}>
        <Box pt="4" pb="2">
          {avatar && avatar.src ? (
            <Image
              borderRadius="12px"
              cursor="pointer"
              fit="contain"
              h="200px"
              src={avatar.src}
              onClick={avatar ? () => setAvatarModal(true) : null}
            />
          ) : (
            <Avatar
              name={user.username}
              src={avatar && avatar.src}
              size="2xl"
              onClick={avatar ? () => setAvatarModal(true) : null}
              style={{ cursor: avatar ? 'pointer' : 'default' }}
            />
          )}
        </Box>
        <Box>
          <Text fontWeight="bold" fontSize="xl">
            {user.username}{' '}
            <Text as="span" fontSize="sm" fontWeight="light">
              {role}
            </Text>
          </Text>
        </Box>
        <Box>
          <Text>{getFullName(user)}</Text>
        </Box>
        <Box mb="2">
          {membershipsLength > 1 && (
            <Popover
              bg="gray.50"
              placement="bottom-start"
              trigger={
                <Button
                  colorScheme="gray.600"
                  fontWeight="light"
                  textDecoration="underline"
                  variant="link"
                >
                  {t('profile.message.memberships', { count: membershipsLength })}
                </Button>
              }
            >
              <Box p="1">
                {memberships.map((m) => (
                  <Button
                    colorScheme="gray.800"
                    fontWeight="light"
                    my="1"
                    textDecoration="underline"
                    variant="link"
                    onClick={() => (window.location.href = `https://${m.host}/@${user.username}`)}
                  >
                    {t('profile.message.membership', { host: m.host, role: m.role })}
                  </Button>
                ))}
              </Box>
            </Popover>
          )}
        </Box>
      </Flex>

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

      {avatar && (
        <Modal
          isOpen={avatarModal}
          onClose={() => setAvatarModal(false)}
          onOpen={() => setAvatarModal(false)}
          size="xs"
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <Image src={avatar.src} alt={user.username} fit="contain" />
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default MemberAvatarEtc;
