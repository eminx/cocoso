import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
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
import { LinkIcon } from '@chakra-ui/icons/dist/Link';
import { SettingsIcon } from '@chakra-ui/icons/dist/Settings';
import { useTranslation } from 'react-i18next';

import NiceSlider from './NiceSlider';
import { StateContext } from '../LayoutContainer';
import Tabs from './Tabs';
import BackLink from './BackLink';

function TablyCentered({
  action = null,
  adminMenu = null,
  author = null,
  backLink,
  content,
  images,
  subTitle,
  tabs,
  title,
  tags = null,
}) {
  const [copied, setCopied] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const { currentHost, isDesktop } = useContext(StateContext);
  const [tc] = useTranslation('common');

  useEffect(() => {
    setCopied(false);
  }, [location.pathname]);

  const tabIndex = tabs && tabs.findIndex((tab) => tab.path === location.pathname);

  if (tabs && !tabs.find((tab) => tab.path === location.pathname)) {
    return <Redirect to={tabs[0].path} />;
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${currentHost.host}${location.pathname}`);
      setCopied(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Center py="4" w="100%">
      <Box w="100%">
        <Box>
          <Header
            author={author}
            backLink={backLink}
            copied={copied}
            isDesktop={isDesktop}
            subTitle={subTitle}
            tags={tags}
            tc={tc}
            title={title}
            handleCopyLink={handleCopyLink}
          />

          <Center py="2">
            <NiceSlider
              alt={title}
              height={isDesktop ? '400px' : 'auto'}
              images={images}
              isFade={isDesktop}
            />
          </Center>
          <Center mb="4" mx="4">
            {action}
          </Center>
        </Box>

        <Center px="4">
          <Box maxW="540px" w="100%">
            <Box minH="100vh" w="100%">
              {tabs && (
                <Tabs
                  // align="center"
                  colorScheme="gray.800"
                  index={tabIndex}
                  mt="2"
                  tabs={tabs}
                >
                  {adminMenu && <AdminMenu adminMenu={adminMenu} isDesktop={isDesktop} />}
                </Tabs>
              )}

              <Box mb="24">
                {tabs ? (
                  <Switch history={history}>
                    {tabs.map((tab) => (
                      <Route
                        key={tab.title}
                        path={tab.path}
                        render={(props) => (
                          <Box border="1px solid" borderColor="brand.500" p="4">
                            {tab.content}
                          </Box>
                        )}
                      />
                    ))}
                  </Switch>
                ) : (
                  <Box pt="2">{content}</Box>
                )}
              </Box>
            </Box>
          </Box>
        </Center>
      </Box>
    </Center>
  );
}

function Header({
  author,
  backLink,
  copied,
  isDesktop,
  subTitle,
  tags,
  tc,
  title,
  handleCopyLink,
}) {
  const fontFamily = "'Raleway', sans-serif";

  const renderTitles = () => {
    return (
      <Flex px="4" justify={!isDesktop && author ? 'space-between' : 'center'} w="100%">
        <Box pr="4">
          <Heading
            as="h1"
            fontFamily={fontFamily}
            fontSize="1.8em"
            lineHeight={1}
            mb="2"
            mt="1"
            textAlign={!isDesktop && author ? 'left' : 'center'}
            textShadow="1px 1px 1px #fff"
          >
            {title}
          </Heading>
          {subTitle && (
            <Heading
              as="h2"
              fontSize="1.3em"
              fontWeight="light"
              lineHeight={1}
              textAlign={!isDesktop && author ? 'left' : 'center'}
            >
              {subTitle}
            </Heading>
          )}
          {tags && tags.length > 0 && (
            <Flex flexGrow="0" justify={!isDesktop && author ? 'flex-start' : 'center'} mt="4">
              {tags.map(
                (tag) =>
                  tag && (
                    <Badge key={tag} bg="gray.50" color="gray.800" fontSize="14px">
                      {tag}
                    </Badge>
                  )
              )}
            </Flex>
          )}
        </Box>
        {!isDesktop && author && <AvatarHolder size="md" author={author} />}
      </Flex>
    );
  };

  return (
    <Box mb="4" w="100%">
      <Flex justify="space-between">
        <Box flexGrow={0} flexShrink={0} pl="2" width="120px">
          {backLink && <BackLink backLink={backLink} isSmall={!isDesktop} />}
        </Box>
        {isDesktop && renderTitles()}
        <Flex
          align="flex-end"
          flexGrow={0}
          flexShrink={0}
          flexDirection="column"
          pr="4"
          width="120px"
        >
          <Button
            leftIcon={<LinkIcon />}
            mb="4"
            size={isDesktop ? 'md' : 'sm'}
            variant="link"
            onClick={handleCopyLink}
          >
            {copied ? tc('actions.copied') : tc('actions.share')}
          </Button>
          {isDesktop && author && <AvatarHolder size="md" author={author} />}
        </Flex>
      </Flex>
      {!isDesktop && renderTitles()}
    </Box>
  );
}

function AvatarHolder({ author, size = 'lg' }) {
  return (
    <Box>
      <VStack justify="center" spacing="0">
        <Avatar
          borderRadius="8px"
          elevation="medium"
          src={author?.src}
          name={author?.username}
          size={size}
        />
        {author?.link ? (
          <Link to={author?.link}>
            <CLink as="span" fontSize={size}>
              {author?.username}
            </CLink>
          </Link>
        ) : (
          <Text fontSize={size}>{author?.username}</Text>
        )}
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
      <MenuButton fontSize="md" px="4" pb="1">
        {/* {adminMenu.label} */}
        <SettingsIcon color="brand.500" />
      </MenuButton>
      <MenuList>
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

export default TablyCentered;
