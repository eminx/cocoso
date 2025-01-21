import { Meteor } from 'meteor/meteor';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

import { StateContext } from '../LayoutContainer';
import { call } from '../utils/shared';
import ConfirmModal from '../components/ConfirmModal';
import NiceSlider from '../components/NiceSlider';

const publicSettings = Meteor?.settings?.public;

export default function FederationIconMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMyCommunitiesMenuOpen, setIsMyCommunitiesMenuOpen] = useState(false);
  const { currentHost, currentUser, isDesktop, platform } = useContext(StateContext);
  const [hostInfo, setHostInfo] = useState(null);
  const [tc] = useTranslation('common');
  const [t] = useTranslation('members');
  const navigate = useNavigate();

  if (!platform || !platform.isFederationLayout) {
    return null;
  }

  const handleSetHostInfo = async () => {
    try {
      const info = await call('getPortalHostInfoPage');
      setHostInfo(info);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const isFederationLayout = platform && platform.isFederationLayout;
  const isPortalHost = currentHost?.isPortalHost;

  return (
    <Box zIndex={0}>
      <Box ml="2" className="federation-logo">
        <HStack>
          <Image
            fit="contain"
            src="https://samarbetet.s3.eu-central-1.amazonaws.com/emin/adaptive-icon.png"
            w={isDesktop ? '54px' : '40px'}
            h={isDesktop ? '54px' : '40px'}
            zIndex={3}
            onClick={() => handleSetHostInfo()}
          />

          {currentUser && isFederationLayout && (
            <Box>
              <Menu
                isOpen={isMyCommunitiesMenuOpen}
                onOpen={() => setIsMyCommunitiesMenuOpen(true)}
                onClose={() => setIsMyCommunitiesMenuOpen(false)}
              >
                <MenuButton
                  as={Button}
                  bg="white"
                  color="brand.700"
                  fontFamily="'Sarabun', sans-serif"
                  fontSize="15px"
                  fontWeight="normal"
                  lineHeight={1.2}
                  p="2"
                  rightIcon={<ChevronDownIcon size="18px" />}
                  textAlign="left"
                  variant="link"
                >
                  {t('profile.myCommunities')}
                </MenuButton>

                <MenuList zIndex="1400">
                  {currentUser?.memberships?.map((m) => (
                    <MenuItem key={m.host} onClick={() => (location.href = `https://${m.host}`)}>
                      {m.hostname}
                    </MenuItem>
                  ))}
                  <Divider colorScheme="gray.700" mt="2" />
                  <MenuItem
                    key="all-communities"
                    onClick={() =>
                      currentHost?.isPortalHost
                        ? navigate('/communities')
                        : (location.href = `https://${platform?.portalHost}/communities`)
                    }
                  >
                    {tc('labels.allCommunities')}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )}
        </HStack>

        <Modal isOpen={isMyCommunitiesMenuOpen}>
          <ModalOverlay
            onClick={() => {
              setIsMyCommunitiesMenuOpen(false);
            }}
          />
        </Modal>
      </Box>

      <Box pl="2">
        <ConfirmModal
          confirmText={tc('modals.toPortalApp')}
          hideFooter={isPortalHost && isFederationLayout}
          isCentered
          scrollBehavior="inside"
          size="2xl"
          title={publicSettings.name}
          visible={isOpen}
          onConfirm={() => (window.location.href = `https://${platform.portalHost}`)}
          onCancel={() => setIsOpen(false)}
          onOverlayClick={() => setIsOpen(false)}
        >
          {hostInfo && (
            <Box>
              {hostInfo.images && (
                <Center mb="6">
                  <NiceSlider alt={hostInfo.title} height="auto" images={hostInfo.images} />
                </Center>
              )}

              {hostInfo.longDescription && (
                <Box className="text-content">{parseHtml(hostInfo?.longDescription)}</Box>
              )}
            </Box>
          )}
        </ConfirmModal>
      </Box>
    </Box>
  );
}
