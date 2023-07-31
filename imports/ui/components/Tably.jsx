import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Grid,
  GridItem,
  Link as CLink,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons/dist/Settings';
import { ChevronLeftIcon } from '@chakra-ui/icons/dist/ChevronLeft';
import { LinkIcon } from '@chakra-ui/icons/dist/Link';
import { useTranslation } from 'react-i18next';

import NiceSlider from './NiceSlider';
import { StateContext } from '../LayoutContainer';
import Tabs from './Tabs';

function Tably({
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

  const desktopGridColumns = author ? '3fr 4fr 1fr' : '3fr 4fr 0fr';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${currentHost.host}${location.pathname}`);
      setCopied(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (isDesktop) {
    return (
      <>
        <Grid templateColumns={desktopGridColumns}>
          <GridItem>
            <Flex>
              {backLink && <BackLink backLink={backLink} />}
              <Box w="100%">
                <Header author={author} isDesktop subTitle={subTitle} tags={tags} title={title} />
              </Box>
            </Flex>
          </GridItem>

          <GridItem pl="16">
            {action && (
              <Container m="0" p="0">
                <Box mb="8">{action}</Box>
              </Container>
            )}
            {tabs && (
              <Tabs colorScheme="gray.800" index={tabIndex} size="md" tabs={tabs} mb="0">
                {adminMenu && <AdminMenu adminMenu={adminMenu} isDesktop={isDesktop} />}
              </Tabs>
            )}
          </GridItem>

          <GridItem>
            <Flex flexDirection="column" justify="center">
              {author && <AvatarHolder author={author} />}
              {backLink && (
                <Center p="4" mr="2">
                  <Button leftIcon={<LinkIcon />} variant="link" w="100px" onClick={handleCopyLink}>
                    {copied ? tc('actions.copied') : tc('actions.share')}
                  </Button>
                </Center>
              )}
            </Flex>
          </GridItem>

          <GridItem mt="4">
            <Flex flexGrow="0" justify={isDesktop ? 'flex-end' : 'center'} mb="4">
              <NiceSlider images={images} width="550px" max />
            </Flex>
          </GridItem>

          <GridItem pl="12" mt="4">
            <Box mb="24">
              {tabs ? (
                <Switch history={history}>
                  {tabs.map((tab) => (
                    <Route
                      key={tab.title}
                      path={tab.path}
                      render={(props) => <Container m="0">{tab.content}</Container>}
                    />
                  ))}
                </Switch>
              ) : (
                <Container m="0">{content}</Container>
              )}
            </Box>
          </GridItem>

          <GridItem />
        </Grid>
      </>
    );
  }

  return (
    <>
      <Box>
        <Box mb="2">{backLink && <BackLink backLink={backLink} isSmall />}</Box>
        <Box>
          <Header
            author={author}
            backLink={backLink}
            copied={copied}
            isDesktop={false}
            subTitle={subTitle}
            tags={tags}
            tc={tc}
            title={title}
            handleCopyLink={handleCopyLink}
          />

          <Center bg="gray.900">
            <NiceSlider alt={title} images={images} width="100vw" isFade={false} />
          </Center>
          <Center mb="4" mx="4">
            {action}
          </Center>
        </Box>

        <Box minH="100vh">
          {tabs && (
            <Tabs
              align="center"
              colorScheme="gray.800"
              index={tabIndex}
              mt="2"
              size="sm"
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
                      <Center>
                        <Container margin={'auto'} p="0" pt="4">
                          {tab.content}
                        </Container>
                      </Center>
                    )}
                  />
                ))}
              </Switch>
            ) : (
              <Center>
                <Container margin={'auto'} pt="2">
                  {content}
                </Container>
              </Center>
            )}
          </Box>
        </Box>
      </Box>
    </>
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

  return (
    <Flex mb={isDesktop ? '8' : '8'} pl="4" pr="0" justify="space-between">
      <Box flexBasis={isDesktop ? '100%' : '80%'}>
        <Heading
          as="h1"
          fontFamily={fontFamily}
          fontSize="1.8em"
          lineHeight={1}
          mb="3"
          mt="1"
          textAlign={isDesktop ? 'right' : 'left'}
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
            textAlign={isDesktop ? 'right' : 'left'}
          >
            {subTitle}
          </Heading>
        )}
        {tags && tags.length > 0 && (
          <Flex
            flexGrow="0"
            justify={isDesktop ? 'flex-end' : 'flex-start'}
            mt={isDesktop ? '6' : '4'}
          >
            {tags.map((tag) => (
              <Badge
                bg="gray.50"
                color="gray.800"
                fontSize="14px"
                key={tag}
                ml={isDesktop && '2'}
                mr={!isDesktop && '2'}
              >
                {tag}
              </Badge>
            ))}
          </Flex>
        )}
      </Box>
      {!isDesktop && (
        <Flex flexDirection="column" justify="center">
          {author && (
            <Box flexBasis="64px" align="center">
              <AvatarHolder size="md" author={author} />
            </Box>
          )}
          {backLink && (
            <Box px="4">
              <Button leftIcon={<LinkIcon />} variant="link" onClick={handleCopyLink}>
                {copied ? tc('actions.copied') : tc('actions.share')}
              </Button>
            </Box>
          )}
        </Flex>
      )}
    </Flex>
  );
}

function AvatarHolder({ author, size = 'lg' }) {
  return (
    <Box pr="2">
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
      <MenuButton fontSize="md" lineHeight="1.1" px="4" mt={isDesktop ? '0' : '-1'}>
        {/* {adminMenu.label} */}
        <SettingsIcon color="brand.500" />
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

function BackLink({ backLink, isSmall = false }) {
  if (!backLink) {
    return null;
  }
  return (
    <Link to={backLink?.value}>
      <Button
        as="span"
        leftIcon={<ChevronLeftIcon mr="-2" fontSize="xl" />}
        ml="2"
        mt="1"
        size={isSmall ? 'sm' : 'md'}
        variant="link"
      >
        {backLink?.label}
      </Button>
    </Link>
  );
}

export default Tably;
