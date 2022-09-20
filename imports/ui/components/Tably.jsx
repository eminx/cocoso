import React, { useContext } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Box, Container, Flex, Heading, Link as CLink, Tabs, Tab, TabList } from '@chakra-ui/react';

import NiceSlider from './NiceSlider';
import { StateContext } from '../LayoutContainer';

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

  const { menu } = currentHost?.settings;

  const navItem = menu.find((item) => item.name === navPath);

  return (
    <>
      <Flex my="4" w="100%">
        <Box px="4" flexBasis="120px">
          <Link to={`/${navPath}`}>
            <CLink as="span" textTransform="uppercase">
              {navItem?.label}
            </CLink>
          </Link>
        </Box>
        <Box flexBasis="120px"></Box>
      </Flex>
      <Flex direction={isDesktop ? 'row' : 'column'} w="100%" m={isDesktop ? '4' : '0'}>
        {isImage && (
          <Box w="100%" flexBasis={isDesktop ? '40%' : '100%'}>
            <Flex direction="column" mb={isDesktop ? '16' : '4'}>
              <Heading as="h3" size="lg" textAlign={isDesktop ? 'right' : 'center'}>
                {title}
              </Heading>
              {subTitle && (
                <Heading
                  as="h4"
                  size="md"
                  fontWeight="light"
                  textAlign={isDesktop ? 'right' : 'center'}
                >
                  {subTitle}
                </Heading>
              )}
            </Flex>
            <Flex
              // flexBasis="40%"
              flexGrow="0"
              justifyContent="flex-end"
              mb="4"
              // w={isDesktop ? '40%' : '100%'}
              w="100%"
            >
              <NiceSlider images={images} />
              {/* <Image fit="contain" src={activityData.imageUrl} htmlHeight="100%" width="100%" />} */}
            </Flex>
          </Box>
        )}
        <Box flexBasis="50%" px={isDesktop ? '16' : '4'} mt="2">
          <Tabs
            align={isImage ? 'start' : 'center'}
            colorScheme="gray.800"
            defaultIndex={getDefaultTabIndex()}
            flexShrink="0"
            size="sm"
          >
            <TabList mb="4" flexWrap="wrap">
              {tabs.map((tab) => (
                <Link key={tab.title} to={parsePath(tab.path)}>
                  <Tab
                    _focus={{ boxShadow: 'none' }}
                    textTransform="uppercase"
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
                  <Container margin={isImage ? 0 : 'auto'} px="0" pt="2">
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
