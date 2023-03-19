import React, { useContext, useState } from 'react';
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
import { StateContext } from '../LayoutContainer';

function MemberAvatarEtc({ t, tc, user }) {
  const [avatarModal, setAvatarModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentHost, isDesktop, role } = useContext(StateContext);

  if (!user) {
    return null;
  }

  const { avatar } = user;

  return (
    <>
      <Flex px="6" flexDirection="column" align={isDesktop ? 'flex-start' : 'center'}>
        <Box pt="4" pb="2">
          {avatar && avatar.src ? (
            <Image
              borderRadius="12px"
              // boxShadow="0 2px 5px #aaa "
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
              ({role})
            </Text>
          </Text>
        </Box>
        <Box mb="2">
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
    </>
  );
}

export default MemberAvatarEtc;
