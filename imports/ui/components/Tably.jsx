import React, { useContext } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
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
  content,
  images,
  subTitle,
  tabs,
  title,
  tags = null,
}) {
  const history = useHistory();
  const location = useLocation();
  const { isDesktop } = useContext(StateContext);
  const tabIndex = tabs && tabs.findIndex((tab) => tab.path === location.pathname);

  if (tabs && !tabs.find((tab) => tab.path === location.pathname)) {
    return <Redirect to={tabs[0].path} />;
  }

  if (isDesktop) {
    return (
      <>
        <Grid templateColumns="2fr 2fr 1fr">
          <GridItem>
            <Box>
              <Header
                author={author}
                title={title}
                subTitle={subTitle}
                tags={tags}
                isDesktop={isDesktop}
              />
            </Box>
          </GridItem>

          <GridItem pl="12">
            {action && (
              <Box mx="4" mb="8">
                {action}/
              </Box>
            )}
            {tabs && (
              <Tabs colorScheme="gray.800" index={tabIndex} size="md" tabs={tabs}>
                {adminMenu && <AdminMenu adminMenu={adminMenu} isDesktop={isDesktop} />}
              </Tabs>
            )}
          </GridItem>
          <GridItem>{author && <AvatarHolder author={author} />}</GridItem>

          <GridItem>
            <Flex flexGrow="0" justify={isDesktop ? 'flex-end' : 'center'} mb="4">
              <NiceSlider images={images} width="550px" max />
            </Flex>
          </GridItem>

          <GridItem pl="12">
            <Box mb="24">
              {tabs ? (
                <Switch history={history}>
                  {tabs.map((tab) => (
                    <Route
                      key={tab.title}
                      path={tab.path}
                      render={(props) => <Container margin={'auto'}>{tab.content}</Container>}
                    />
                  ))}
                </Switch>
              ) : (
                <Container margin="auto">{content}</Container>
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
        <Box>
          <Header
            author={author}
            title={title}
            subTitle={subTitle}
            tags={tags}
            isDesktop={isDesktop}
          />

          <Center>
            <NiceSlider images={images} width="100vw" isFade={false} />
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
                        <Container margin={'auto'} pt="2">
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

function Header({ title, subTitle, tags, isDesktop, author }) {
  return (
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
