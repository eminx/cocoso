import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Link as CLink,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

import NiceSlider from './NiceSlider';
import { StateContext } from '../LayoutContainer';
import Tabs from './Tabs';

function Tably({
  action = null,
  adminMenu = null,
  author = null,
  images,
  navPath,
  subTitle,
  tabs,
  title,
  tags = null,
}) {
  const history = useHistory();
  const location = useLocation();
  const { isDesktop, currentHost } = useContext(StateContext);
  const imageContainer = useRef();
  const [imageContainerTop, setImageContainerTop] = useState(null);

  useLayoutEffect(() => {
    setTimeout(() => {
      const rect = imageContainer?.current?.getBoundingClientRect();
      setImageContainerTop(rect ? rect.top : null);
    }, 200);
  }, [imageContainer]);

  const getDefaultTabIndex = () => {
    return tabs.findIndex((tab) => tab.path === location.pathname);
  };

  if (!tabs.find((tab) => tab.path === location.pathname)) {
    return <Redirect to={tabs[0].path} />;
  }

  const isImage = images && images?.length > 0;

  const { menu, name } = currentHost?.settings;

  const navItem = menu.find((item) => item.name === navPath);

  return (
    <>
      <Flex my="4">
        <Flex px="4">
          <Link to="/">
            <CLink as="span" textTransform="uppercase" fontWeight="bold">
              {name}
            </CLink>
          </Link>
          <Text mx="2">/</Text>
          <Link to={`/${navPath}`}>
            <CLink as="span" textTransform="uppercase">
              {navItem?.label}
            </CLink>
          </Link>
        </Flex>
        <Box></Box>
      </Flex>
      <Flex direction={isDesktop ? 'row' : 'column'} mt={isDesktop ? '6' : '0'} wrap>
        {isImage && (
          <Box w={isDesktop ? '40%' : '100%'}>
            <Flex mb={isDesktop ? '16' : '8'} pl="4" pr="0" justify="space-between">
              <Box flexBasis={isDesktop ? '100%' : '80%'}>
                <Heading
                  as="h1"
                  size="xl"
                  lineHeight={1}
                  mb="2"
                  mt="1"
                  textAlign={isDesktop ? 'right' : 'left'}
                >
                  {title}
                </Heading>
                {subTitle && (
                  <Heading
                    as="h2"
                    fontSize="24px"
                    fontWeight="light"
                    lineHeight={1}
                    textAlign={isDesktop ? 'right' : 'left'}
                  >
                    {subTitle}
                  </Heading>
                )}
                {tags && tags.length > 0 && (
                  <Flex justify={isDesktop ? 'flex-end' : 'flex-start'} mt="2">
                    {tags.map((tag) => (
                      <Badge fontSize="14px" key={tag} ml={isDesktop && '2'} mr={!isDesktop && '2'}>
                        {tag}
                      </Badge>
                    ))}
                  </Flex>
                )}
              </Box>
              {!isDesktop && author && (
                <Box flexBasis="64px" align="center">
                  <AvatarHolder size="md" author={author} />
                </Box>
              )}
            </Flex>
            <Flex flexGrow="0" justify="flex-end" mb="4" ref={imageContainer}>
              <NiceSlider images={images} isFade={isDesktop} width={isDesktop ? '40%' : '100%'} />
            </Flex>
          </Box>
        )}

        <Box w={isDesktop && isImage ? '40%' : '100%'} pl={isDesktop && isImage ? '12' : '0'}>
          {!isImage && (
            <Box p="4">
              <Heading as="h1" size="xl" textAlign={isDesktop ? 'center' : 'left'}>
                {title}
              </Heading>
              {subTitle && (
                <Heading
                  as="h2"
                  fontSize="24px"
                  fontWeight="light"
                  textAlign={isDesktop ? 'center' : 'left'}
                >
                  {subTitle}
                </Heading>
              )}
            </Box>
          )}
          {action}
          <Tabs
            align={isDesktop && isImage ? 'start' : 'center'}
            colorScheme="gray.800"
            defaultIndex={getDefaultTabIndex()}
            flexShrink="0"
            mt="2"
            size={isDesktop ? 'md' : 'sm'}
            tabs={tabs}
          >
            {adminMenu && <AdminMenu adminMenu={adminMenu} isDesktop={isDesktop} />}
          </Tabs>

          {imageContainerTop && (
            <Box
              mt={isDesktop ? `${imageContainerTop - 120}px` : '0'}
              h={isDesktop && isImage ? `calc(100vh - ${imageContainerTop + 50}px)` : 'auto'}
              overflowY="scroll"
            >
              <Switch history={history}>
                {tabs.map((tab) => (
                  <Route
                    key={tab.title}
                    path={tab.path}
                    render={(props) =>
                      isDesktop ? (
                        <Container margin={isImage ? 0 : 'auto'} pt="2">
                          {tab.content}
                        </Container>
                      ) : (
                        <Center>
                          <Container margin={isImage ? 0 : 'auto'} pt="2">
                            {tab.content}
                          </Container>
                        </Center>
                      )
                    }
                  />
                ))}
              </Switch>
            </Box>
          )}
        </Box>

        {isDesktop && author && (
          <Box w="20%">
            <Center>
              <AvatarHolder author={author} />
            </Center>
          </Box>
        )}
      </Flex>
    </>
  );
}

function AvatarHolder({ author, size = 'lg' }) {
  return (
    <Box pr="2">
      <VStack justify="center" spacing="0">
        <Avatar elevation="medium" src={author?.src} name={author?.username} size={size} />
        <Link to={author?.link}>
          <CLink as="span" fontSize={size}>
            {author?.username}
          </CLink>
        </Link>
      </VStack>
    </Box>
  );
}

function AdminMenu({ adminMenu, isDesktop }) {
  if (!adminMenu || !adminMenu.label || !adminMenu.items) {
    return null;
  }

  return (
    <Menu direction="rtl" placement="bottom-end">
      <MenuButton fontSize="md" lineHeight="1.1" px="4" mt={isDesktop ? '-1' : '-2'}>
        {/* {adminMenu.label} */}
        <SettingsIcon />
      </MenuButton>
      <MenuList bg="gray.200">
        {adminMenu.items.map((item) =>
          item.link ? (
            <Link to={item.link} key={item.label}>
              <MenuItem>{item.label}</MenuItem>
            </Link>
          ) : (
            <MenuItem key={item.label} onClick={item.onClick}>
              {item.label}
            </MenuItem>
          )
        )}
      </MenuList>
    </Menu>
  );
}

export default Tably;
