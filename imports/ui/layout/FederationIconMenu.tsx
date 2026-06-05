import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import { Button, Divider, Flex, Image, Modal } from '/imports/ui/core';
import Menu, { MenuItem } from '/imports/ui/generic/Menu';
import {
  currentHostAtom,
  currentUserAtom,
  isDesktopAtom,
  platformAtom,
} from '/imports/state';
import RegistrationIntro from '/imports/ui/pages/auth/RegistrationIntro';

export default function FederationIconMenu() {
  const currentHost = useAtomValue(currentHostAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const isDesktop = useAtomValue(isDesktopAtom);
  const platform = useAtomValue(platformAtom);

  const [infoOpen, setInfoOpen] = useState(false);
  const [tc] = useTranslation('common');
  const [t] = useTranslation('members');
  const navigate = useNavigate();

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
          onClick={() => setInfoOpen(true)}
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
        cancelText={tc('actions.close')}
        hideFooter={isPortalHost}
        hideHeader
        id="federation-icon-menu"
        open={infoOpen}
        size="2xl"
        title={platform?.name || 'Platform'}
        onConfirm={() =>
          (window.location.href = `https://${platform?.portalHost}`)
        }
        onClose={() => setInfoOpen(false)}
      >
        <RegistrationIntro isModal />
      </Modal>
    </>
  );
}
