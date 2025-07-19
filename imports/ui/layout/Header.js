import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trans } from 'react-i18next';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
} from '/imports/ui/core';
import Menu, { MenuItem } from '/imports/ui/generic/Menu';
import useMediaQuery from '/imports/api/_utils/useMediaQuery';

import { parseTitle } from '../utils/shared';

const isClient = Meteor?.isClient;

if (isClient) {
  import '@szhsin/react-menu/dist/index.css';
  import '@szhsin/react-menu/dist/transitions/zoom.css';
}

const borderColor = 'var(--cocoso-colors-gray-600) !important';
const baseTextStyles = {
  borderBottom: '2px solid transparent',
  fontFamily: 'Raleway, Sarabun, sans-serif',
  fontSize: 16,
  fontWeight: '500',
  ':hover': {
    borderBottomColor: borderColor,
    borderBottomWidth: '1px',
  },
};

export function InfoPagesMenu({ label, menuStyles, pageTitles, pathname }) {
  const isCurrentContext = pathname.includes('info');

  const flexStyles = {
    align: 'center',
    pointerEvents: 'none',
    px: '2',
  };

  const textStyles = {
    ...baseTextStyles,
    color: menuStyles?.color || 'gray.600',
    fontStyle: menuStyles?.fontStyle || 'normal',
    marginRight: '0.25rem',
    textTransform: menuStyles?.textTransform || 'none',
  };

  return (
    <Menu
      align="end"
      id="info-pages-menu"
      suppressHydrationWarning
      button={
        <Flex
          align="center"
          gap="1"
          css={{
            ...flexStyles,
            borderBottom: isCurrentContext ? `2px solid ${borderColor}` : '',
          }}
        >
          <Text css={textStyles}>{label}</Text>
          <ChevronDownIcon size="16px" />
        </Flex>
      }
    >
      <Box
        css={{
          maxHeight: '480px',
          overflowY: 'scroll',
          rootProps: { style: { zIndex: 1051 } },
        }}
      >
        {pageTitles.map((item) => (
          <Link key={item._id} to={`/info/${parseTitle(item.title)}`}>
            <MenuItem as="span" color="gray.600" id={item._id}>
              {item.title}
            </MenuItem>
          </Link>
        ))}
      </Box>
    </Menu>
  );
}

function HeaderMenu({ Host, pageTitles }) {
  const location = useLocation();
  const { pathname } = location;
  const isDesktop = useMediaQuery('(min-width: 960px)');

  const settings = Host?.settings;
  const menuStyles = Host?.theme?.menu;

  const { isBurgerMenuOnDesktop, isBurgerMenuOnMobile } = settings || {};

  if (isDesktop && isBurgerMenuOnDesktop) {
    return null;
  }

  if (!isDesktop && isBurgerMenuOnMobile && isClient) {
    return null;
  }

  const menuItems = settings?.menu?.filter((item) => item.isVisible);

  const isCurrentContext = (item, index) => {
    if (pathname === '/') {
      return index === 0;
    }
    return pathname.includes(item?.name);
  };

  return (
    <Center className="main-menu" mb="4" px="4">
      <HStack
        align="center"
        justify="center"
        mb="2"
        p="2"
        wrap="wrap"
        style={menuStyles}
      >
        {menuItems?.map((item, index) =>
          item.name === 'info' ? (
            <InfoPagesMenu
              key="info"
              label={item.label}
              menuStyles={menuStyles}
              pageTitles={pageTitles}
              pathname={pathname}
            />
          ) : (
            <Link
              key={item.name}
              to={item.isComposablePage ? `/cp/${item.name}` : `/${item.name}`}
            >
              <Box as="span" px="2">
                <Text
                  css={{
                    ...baseTextStyles,
                    borderBottomColor: isCurrentContext(item, index)
                      ? borderColor
                      : 'transparent',
                  }}
                >
                  {item.label}
                </Text>
              </Box>
            </Link>
          )
        )}
        {Host.isPortalHost && (
          <Link to="/communities">
            <Box as="span" px="2">
              <Text
                css={{
                  ...baseTextStyles,
                  borderBottomColor:
                    pathname === '/communities' ? borderColor : 'transparent',
                }}
              >
                <Trans i18nKey="common:platform.communities">Communities</Trans>
              </Text>
            </Box>
          </Link>
        )}
      </HStack>
    </Center>
  );
}

export default function Header({ Host, pageTitles, isLogoSmall = false }) {
  const currentHost = Host;

  if (!currentHost) {
    return null;
  }

  return (
    <Box w="100%">
      <Center mb="10">
        <Link to="/">
          {currentHost.logo ? (
            <Box maxH={isLogoSmall ? '48px' : '96px'} p="2">
              <Image
                src={Host.logo}
                css={{
                  height: isLogoSmall ? '48px' : '96px',
                  maxWidth: '360px',
                  objectFit: 'contain',
                  width: '100%',
                }}
              />
            </Box>
          ) : (
            <Box>
              <Heading
                color="theme.800"
                fontWeight="400"
                fontFamily="Raleway, Sarabun, sans-serif"
              >
                {currentHost.settings?.name}
              </Heading>
            </Box>
          )}
        </Link>
      </Center>

      <HeaderMenu Host={Host} pageTitles={pageTitles} />
    </Box>
  );
}
