import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  Modal,
} from '/imports/ui/core';
import Menu, { MenuItem } from '/imports/ui/generic/Menu';

import { call } from '/imports/ui/utils/shared';
import NiceSlider from '/imports/ui/generic/NiceSlider';
import { StateContext } from '/imports/ui/LayoutContainer';

export default function FederationIconMenu() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hostInfo, setHostInfo] = useState(null);
  const { allHosts, currentHost, currentUser, isDesktop, platform } =
    useContext(StateContext);
  const [tc] = useTranslation('common');
  const [t] = useTranslation('members');
  const navigate = useNavigate();

  const handleSetHostInfo = async () => {
    try {
      const info = await call('getPortalHostInfoPage');
      console.log('Host info received:', info);
      setHostInfo(info);
      setInfoOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const isPortalHost = currentHost?.isPortalHost;

  if (!platform || !platform.isFederationLayout) {
    return null;
  }

  return (
    <>
      <Flex
        align="center"
        className="federation-logo"
        gap="0"
        mr="1"
        ml="2"
        p="1"
        css={{
          borderRadius: 'var(--cocoso-border-radius)',
          backgroundColor: 'rgba(255, 252, 250, 0.9)',
          '&:hover': {
            backgroundColor: 'white',
          },
        }}
      >
        <Image
          src="https://samarbetet.s3.eu-central-1.amazonaws.com/emin/adaptive-icon.png"
          css={{
            cursor: 'pointer',
            objectFit: 'contain',
            width: isDesktop ? '44px' : '28px',
            height: isDesktop ? '44px' : '28px',
            borderRadius: 'var(--cocoso-border-radius)',
            '&:hover': {
              filter: 'invert(100%)',
              transition: 'all .2s ease-in-out',
            },
          }}
          onClick={() => handleSetHostInfo()}
        />

        {currentUser ? (
          <Menu align="start" buttonLabel={t('profile.myCommunities')}>
            {currentUser.memberships?.map((m) => (
              <MenuItem
                key={m.host}
                onClick={() => (location.href = `https://${m.host}`)}
              >
                {m.hostname}
              </MenuItem>
            ))}
            <Divider />
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
          </Menu>
        ) : (
          <Link to="/communities">
            <Button as="div" ml="1" size="sm" variant="ghost">
              {tc('labels.allCommunities')}
            </Button>
          </Link>
        )}
      </Flex>

      <Modal
        confirmText={tc('modals.toPortalApp')}
        hideFooter={isPortalHost}
        id="federation-icon-menu"
        open={infoOpen}
        size="2xl"
        title={platform?.name || 'Platform'}
        onConfirm={() =>
          (window.location.href = `https://${platform?.portalHost}`)
        }
        onClose={() => setInfoOpen(false)}
      >
        {hostInfo && (
          <Box>
            {hostInfo.images && (
              <Center mb="6">
                <NiceSlider
                  alt={hostInfo.title}
                  height="auto"
                  images={hostInfo.images}
                />
              </Center>
            )}

            {hostInfo.longDescription && (
              <Box className="text-content">
                {typeof hostInfo.longDescription === 'string'
                  ? HTMLReactParser(hostInfo.longDescription)
                  : hostInfo.longDescription}
              </Box>
            )}
          </Box>
        )}
      </Modal>
    </>
  );
}
