import React, { useContext } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Heading,
  Link as CLink,
  Tabs,
  Tab,
  TabList,
  Text,
} from '@chakra-ui/react';

import NiceSlider from './NiceSlider';
import { StateContext } from '../LayoutContainer';

const tabStyle = {
  textTransform: 'uppercase',
  // paddingLeft: 0,
  // paddingRight: 0,
  // marginLeft: 12,
  // marginRight: 12,
};

function Tably({ tabs, title, subTitle, images, navPath }) {
  const history = useHistory();
  const location = useLocation();
  const { isDesktop, currentHost } = useContext(StateContext);

  const getDefaultTabIndex = () => {
    return tabs.findIndex((tab) => tab.path === location.pathname);
  };

  const parsePath = (path) => {
    const gotoPath = path + '?noScrollTop=true';
    return gotoPath;
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
        <Flex px="4" flexBasis="120px">
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
        <Box flexBasis="120px"></Box>
      </Flex>
      <Flex direction={isDesktop ? 'row' : 'column'} m={isDesktop ? '4' : '0'}>
        {isImage && (
          <Box flexBasis={isDesktop ? '40%' : '100%'}>
            <Box mb={isDesktop ? '16' : '4'} px="4">
              <Heading as="h3" size="xl" textAlign={isDesktop ? 'right' : 'left'}>
                {title}
              </Heading>
              {subTitle && (
                <Heading
                  as="h4"
                  size="md"
                  fontWeight="light"
                  textAlign={isDesktop ? 'right' : 'left'}
                >
                  {subTitle}
                </Heading>
              )}
            </Box>
            <Box flexGrow="0" mb="4">
              <NiceSlider images={images} isFade={isDesktop} width={isDesktop ? '40vw' : '100vw'} />
              {/* <Image fit="contain" src={activityData.imageUrl} htmlHeight="100%" width="100%" />} */}
            </Box>
          </Box>
        )}
        <Box flexBasis={isImage ? '50%' : '100%'} pl={isDesktop && isImage ? '12' : '0'}>
          <Tabs
            align={isImage ? 'start' : 'center'}
            colorScheme="gray.800"
            defaultIndex={getDefaultTabIndex()}
            flexShrink="0"
            mt="2"
            size="sm"
          >
            <TabList flexWrap="wrap" mb="4">
              {tabs.map((tab) => (
                <Link key={tab.title} to={parsePath(tab.path)} style={{ margin: 0 }}>
                  <Tab
                    as="span"
                    _focus={{ boxShadow: 'none' }}
                    style={tabStyle}
                    onClick={tab.onClick}
                  >
                    {tab.title}
                  </Tab>
                </Link>
              ))}
            </TabList>
          </Tabs>

          <Switch history={history}>
            {tabs.map((tab) => (
              <Route
                key={tab.title}
                path={tab.path}
                render={(props) => (
                  <Container margin={isImage ? 0 : 'auto'} pt="2">
                    {tab.content}
                  </Container>
                )}
              />
            ))}
          </Switch>
        </Box>
      </Flex>
    </>
  );
}

export default Tably;
