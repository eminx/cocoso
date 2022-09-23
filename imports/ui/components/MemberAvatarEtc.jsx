import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Center,
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

function MemberAvatarEtc({ t, tc, user }) {
  const [avatarModal, setAvatarModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!user) {
    return null;
  }

  const { avatar } = user;

  return (
    <Center>
      <Flex align="center" p="4">
        <Box align="center" px="2">
          <Avatar
            name={user.username}
            src={avatar && avatar.src}
            size="2xl"
            onClick={avatar ? () => setAvatarModal(true) : null}
            style={{ cursor: avatar ? 'pointer' : 'default' }}
          />
        </Box>
        <Box px="2">
          <Text fontWeight="bold" fontSize="xl">
            {user.username}
          </Text>
          <Text>{getFullName(user)}</Text>
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
    </Center>
  );
}

export default MemberAvatarEtc;
