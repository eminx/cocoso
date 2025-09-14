import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trans } from 'react-i18next';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

import { Box, Center, Flex, Heading, Image, Text } from '/imports/ui/core';
import Menu, { MenuItem } from '/imports/ui/generic/Menu';
import useMediaQuery from '/imports/api/_utils/useMediaQuery';

import { parseTitle } from '../utils/shared';

const isClient = Meteor?.isClient;

if (isClient) {
  import '@szhsin/react-menu/dist/index.css';
  import '@szhsin/react-menu/dist/transitions/zoom.css';
}

const baseTextStyles = {
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'transparent',
  fontFamily: 'Raleway, sans-serif',
  fontSize: 16,
  fontWeight: '500',
};

export function InfoPagesMenu({
  label,
  menuStyles,
  pageTitles,
  pathname,
  onSelect,
}) {
  const isCurrentContext = pathname.split('/')?.[1] === 'info';

  const flexStyles = {
    align: 'center',
    pointerEvents: 'none',
    px: '2',
  };

  const textStyles = {
    ...baseTextStyles,
    color: menuStyles?.color || 'gray.600',
    fontStyle: menuStyles?.fontStyle || 'normal',
    marginTop: '0.25rem',
    marginRight: '0.25rem',
    textTransform: menuStyles?.textTransform || 'none',
  };

  const borderColor = menuStyles?.color;

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
            borderBottom: isCurrentContext
              ? `2px solid ${borderColor}`
              : '2px solid transparent',
            color: menuStyles?.color,
            wrap: 'wrap',
            '&:hover': !isCurrentContext && {
              borderBottomColor: borderColor,
              textDecoration: 'underline',
            },
          }}
        >
          <Text css={textStyles}>{label}</Text>
          <ChevronDownIcon size="16px" />
        </Flex>
      }
    >
      <Box
        css={{
          backgroundColor: menuStyles?.backgroundColor,
          maxHeight: '480px',
          maxWidth: '320px',
          overflowY: 'scroll',
        }}
      >
        {pageTitles.map((item) => (
          <Link
            key={item._id}
            to={`/info/${parseTitle(item.title)}`}
            onClick={onSelect}
          >
            <MenuItem as="span" id={item._id}>
              <Text css={textStyles}>{item.title}</Text>
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

  console.log(menuStyles);

  return (
    <Center id="main-menu" mb="4" px="4">
      <Flex
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
              className="main-menu-item"
              to={item.isComposablePage ? `/cp/${item.name}` : `/${item.name}`}
            >
              <Box as="span" px="2">
                <Text
                  css={{
                    ...baseTextStyles,
                    borderBottomColor: isCurrentContext(item, index)
                      ? menuStyles.color
                      : 'transparent',
                    color: menuStyles?.color,
                    '&:hover': {
                      borderBottomColor: menuStyles?.color,
                      borderBottomWidth: '1px',
                    },
                  }}
                >
                  {item.label}
                </Text>
              </Box>
            </Link>
          )
        )}
        {Host.isPortalHost && (
          <Link className="main-menu-item" to="/communities">
            <Box as="span" px="2">
              <Text
                css={{
                  ...baseTextStyles,
                  borderBottomColor:
                    pathname === '/communities'
                      ? menuStyles.color
                      : 'transparent',
                  color: menuStyles?.color,
                  '&:hover': {
                    borderBottomColor: menuStyles?.color,
                    borderBottomWidth: '1px',
                  },
                }}
              >
                <Trans i18nKey="common:platform.communities">Communities</Trans>
              </Text>
            </Box>
          </Link>
        )}
      </Flex>
    </Center>
  );
}

export default function Header({ Host, pageTitles, isLogoSmall = false }) {
  const currentHost = Host;

  if (!currentHost) {
    return null;
  }

  return (
    <Box id="header" w="100%">
      <Center mb="6">
        <Link className="logo-container" to="/">
          <Box maxH={isLogoSmall ? '48px' : '96px'} p="4">
            {currentHost.logo ? (
              <Image
                src={Host.logo}
                css={{
                  height: isLogoSmall ? '48px' : '96px',
                  maxWidth: '360px',
                  objectFit: 'contain',
                  width: '100%',
                }}
              />
            ) : (
              <Heading
                color="theme.800"
                fontWeight="400"
                fontFamily="Raleway, sans-serif"
              >
                {currentHost.settings?.name}
              </Heading>
            )}
          </Box>
        </Link>
      </Center>

      <HeaderMenu Host={Host} pageTitles={pageTitles} />
    </Box>
  );
}
