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
} from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

import { parseTitle } from '../utils/shared';

const textProps = {
  _hover: { borderBottom: '1px solid' },
  as: 'span',
  borderColor: 'gray.600',
  color: 'gray.600',
  fontFamily: 'Raleway, Sarabun, sans-serif',
  fontSize: 16,
  fontWeight: '500',
  textShadow: '1px 1px 1px #fff',
};

function InfoPagesMenu({ label, pageTitles, pathname }) {
  const context = pathname.split('/')[1];
  const isCurrentContext = context === 'info';

  return (
    <Menu placement="bottom-end">
      <MenuButton
        _hover={{ borderBottom: '1px solid' }}
        id="info-pages-menu"
        mx="2"
        // instanceId={useId()}
        suppressHydrationWarning
      >
        <Flex
          borderBottom={isCurrentContext ? '2px solid' : null}
          align="center"
          pointerEvents="none"
        >
          <Text {...textProps} mr="1">
            {label}
          </Text>
          <ChevronDownIcon size="16px" />
        </Flex>
      </MenuButton>
      <MenuList
        maxHeight="480px"
        overflowY="scroll"
        rootProps={{ zIndex: 1051 }}
        suppressHydrationWarning
      >
        {pageTitles.map((item) => (
          <Link key={item} to={`/info/${parseTitle(item)}`} suppressHydrationWarning>
            <MenuItem as="span" id={item}>
              {item}
            </MenuItem>
          </Link>
        ))}
      </MenuList>
    </Menu>
  );
}

export default function Header({ Host, pageTitles, isLogoSmall = false }) {
  const currentHost = Host;
  const location = useLocation();

  if (!currentHost) {
    return null;
  }

  const { pathname } = location;
  const menuItems = Host?.settings?.menu?.filter((item) => item.isVisible);

  const isCurrentContext = (item) => {
    return pathname.includes(item?.name);
  };

  return (
    <Box w="100%">
      <Center mb="2">
        <Link to="/">
          {currentHost.logo ? (
            <Box maxHeight={isLogoSmall ? '48px' : '76px'} p="2">
              <Img
                h={isLogoSmall ? '48px' : '72px'}
                maxW={280}
                objectFit="contain"
                src={Host.logo}
              />
            </Box>
          ) : (
            <Box>
              <Heading color="brand.800" fontWeight="400" fontFamily="Raleway, Sarabun, sans-serif">
                {currentHost.settings?.name}
              </Heading>
            </Box>
          )}
        </Link>
      </Center>

      <Center p="4" mt="4">
        <HStack
          alignItems="center"
          bg="gray.50"
          borderRadius={6}
          justify="center"
          mb="2"
          p="2"
          wrap="wrap"
        >
          {menuItems?.map((item, index) =>
            item.name === 'info' ? (
              <InfoPagesMenu
                key="info"
                label={item.label}
                pageTitles={pageTitles}
                pathname={pathname}
              />
            ) : (
              <Link key={item.name} to={`/${item.name}`}>
                <Box as="span" px="2">
                  <Text
                    {...textProps}
                    borderBottom={isCurrentContext(item, index) ? '2px solid' : null}
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
                  borderBottom={pathname === '/communities' ? '2px solid' : null}
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
    </Box>
  );
}
