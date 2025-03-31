import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

import { StateContext } from '../LayoutContainer';
import { call } from '../utils/shared';
import ConfirmModal from '../generic/ConfirmModal';
import NiceSlider from '../generic/NiceSlider';

const buttonProps = {
  color: 'gray.700',
  fontFamily: "'Sarabun', sans-serif",
  fontSize: '14px',
  fontWeight: 'normal',
  p: '2',
  px: '0',
  textAlign: 'left',
  variant: 'link',
  isTruncated: true,
  noOfLines: 1,
};

export default function FederationIconMenu() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hostInfo, setHostInfo] = useState(null);
  const { allHosts, currentHost, currentUser, isDesktop, platform } = useContext(StateContext);
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
      setInfoOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const isPortalHost = currentHost?.isPortalHost;

  return (
    <>
      <HStack
        _hover={{ bg: 'white' }}
        bg="rgba(255, 252, 250, 0.9)"
        borderRadius="lg"
        className="federation-logo"
        ml="2"
        mr="1"
        p="1"
      >
        <Image
          _hover={{ filter: 'invert(100%)', transition: 'all .2s ease-in-out' }}
          borderRadius="lg"
          cursor="pointer"
          fit="contain"
          src="https://samarbetet.s3.eu-central-1.amazonaws.com/emin/adaptive-icon.png"
          w={isDesktop ? '44px' : '28px'}
          h={isDesktop ? '44px' : '28px'}
          onClick={() => handleSetHostInfo()}
        />
        {currentUser ? (
          <Menu
            infoOpen={menuOpen}
            onOpen={() => setMenuOpen(true)}
            onClose={() => setMenuOpen(false)}
          >
            <MenuButton {...buttonProps} as={Button} rightIcon={<ChevronDownIcon size="16px" />}>
              {currentUser ? t('profile.myCommunities') : tc('labels.allCommunities')}
            </MenuButton>

            <MenuList>
              {currentUser
                ? currentUser.memberships?.map((m) => (
                    <MenuItem key={m.host} onClick={() => (location.href = `https://${m.host}`)}>
                      {m.hostname}
                    </MenuItem>
                  ))
                : allHosts.map((h) => (
                    <MenuItem key={h.host} onClick={() => (location.href = `https://${h.host}`)}>
                      {h.name}
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
        ) : (
          <Link to="/communities">
            <Button {...buttonProps} as="span">
              {tc('labels.allCommunities')}
            </Button>
          </Link>
        )}
      </HStack>

      <ConfirmModal
        confirmText={tc('modals.toPortalApp')}
        hideFooter={isPortalHost}
        isCentered
        scrollBehavior="inside"
        size="2xl"
        title={platform?.name}
        visible={infoOpen}
        onConfirm={() => (window.location.href = `https://${platform.portalHost}`)}
        onCancel={() => setInfoOpen(false)}
        onOverlayClick={() => setInfoOpen(false)}
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
    </>
  );
}
