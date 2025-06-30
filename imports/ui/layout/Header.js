import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';
import { useHydrated } from 'react-hydration-provider';

import { parseTitle } from '../utils/shared';

const isClient = Meteor?.isClient;

const textProps = {
  _hover: { borderBottom: '1px solid' },
  as: 'span',
  // borderColor: 'gray.600',
  fontFamily: 'Raleway, Sarabun, sans-serif',
  fontSize: 16,
  fontWeight: '500',
  // textShadow: '1px 1px 1px #fff',
};

export function InfoPagesMenu({
  backgroundColor,
  label,
  pageTitles,
  pathname,
}) {
  const context = pathname.split('/')[1];
  const isCurrentContext = context === 'info';
  const hydrated = useHydrated();

  const itemProps = {
    align: 'center',
    as: 'span',
    borderBottom: isCurrentContext ? '2px solid' : null,
    pointerEvents: 'none',
    px: '2',
  };

  if (!hydrated) {
    return (
      <Link key={label} to="/info">
        <Flex {...itemProps}>
          <Text {...textProps} mr="1">
            {label}
          </Text>
          <ChevronDownIcon size="16px" />
        </Flex>
      </Link>
    );
  }

  return (
    <Menu placement="bottom-end">
      <MenuButton
        _hover={{ borderBottom: '1px solid' }}
        id="info-pages-menu"
        suppressHydrationWarning
      >
        <Flex {...itemProps}>
          <Text {...textProps} mr="1">
            {label}
          </Text>
          <ChevronDownIcon size="16px" />
        </Flex>
      </MenuButton>
      <MenuList
        maxHeight="480px"
        overflowY="scroll"
        rootProps={{ style: { backgroundColor }, zIndex: 1051 }}
        suppressHydrationWarning
      >
        {pageTitles.map((item) => (
          <Link
            key={item._id}
            to={`/info/${parseTitle(item.title)}`}
            suppressHydrationWarning
          >
            <MenuItem as="span" color="gray.600" id={item._id}>
              {item.title}
            </MenuItem>
          </Link>
        ))}
      </MenuList>
    </Menu>
  );
}

function HeaderMenu({ Host, pageTitles }) {
  const location = useLocation();
  const { pathname } = location;
  const [isDesktop] = useMediaQuery(['(min-width: 960px)']);

  const settings = Host?.settings;
  const style = Host?.style;

  const { isBurgerMenuOnDesktop, isBurgerMenuOnMobile } =
    settings || {};

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

  const backgroundColor = style?.menu?.backgroundColor;
  const color = style?.menu?.color;

  return (
    <Center className="main-menu" mb="4" px="4">
      <HStack
        alignItems="center"
        bg={backgroundColor || 'gray.50'}
        borderRadius={6}
        color={color || 'gray.600'}
        justify="center"
        mb="2"
        p="2"
        wrap="wrap"
      >
        {menuItems?.map((item, index) =>
          item.name === 'info' ? (
            <InfoPagesMenu
              key="info"
              backgroundColor={backgroundColor}
              label={item.label}
              pageTitles={pageTitles}
              pathname={pathname}
            />
          ) : (
            <Link
              key={item.name}
              to={
                item.isComposablePage
                  ? `/cp/${item.name}`
                  : `/${item.name}`
              }
            >
              <Box as="span" px="2">
                <Text
                  {...textProps}
                  borderBottom={
                    isCurrentContext(item, index) ? '2px solid' : null
                  }
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
                {...textProps}
                borderBottom={
                  pathname === '/communities' ? '2px solid' : null
                }
              >
                <Trans i18nKey="platform.communities" ns="common">
                  Communities
                </Trans>
              </Text>
            </Box>
          </Link>
        )}
      </HStack>
    </Center>
  );
}

export default function Header({
  Host,
  pageTitles,
  isLogoSmall = false,
}) {
  const currentHost = Host;

  if (!currentHost) {
    return null;
  }

  return (
    <Box w="100%">
      <Center mb="10">
        <Link to="/">
          {currentHost.logo ? (
            <Box maxHeight={isLogoSmall ? '48px' : '96px'} p="2">
              <Img
                h={isLogoSmall ? '48px' : '96px'}
                maxW={360}
                objectFit="contain"
                src={Host.logo}
              />
            </Box>
          ) : (
            <Box>
              <Heading
                color="brand.800"
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
