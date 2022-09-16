import React, { useContext } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Box, Container, Flex, Heading, Link as CLink, Tabs, Tab, TabList } from '@chakra-ui/react';

import NiceSlider from './NiceSlider';
import { StateContext } from '../LayoutContainer';

function Tably({ tabs, title, subTitle, images, nav }) {
  const history = useHistory();
  const location = useLocation();
  const { isDesktop } = useContext(StateContext);

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

  const isImage = images && images.length > 0;

  return (
    <>
      <Flex my="4" w="100%">
        <Box p="4" flexBasis="120px">
          <Link to={nav.path}>
            <CLink as="span" fontSize="sm" textTransform="uppercase">
              {nav.label}
            </CLink>
          </Link>
        </Box>
        <Flex flexBasis="600px" flexGrow={2} direction="column" justify="center">
          <Heading as="h3" size="lg" textAlign="center">
            {title}
          </Heading>
          {subTitle && (
            <Heading as="h4" size="md" fontWeight="light" textAlign="center">
              {subTitle}
            </Heading>
          )}
        </Flex>
        <Box flexBasis="120px"></Box>
      </Flex>
      <Flex justify="center" direction={isDesktop ? 'row' : 'column'}>
        {isImage && (
          <Box flexBasis="50%" flexGrow="0" mb="4" w={isDesktop ? '50%' : '100%'}>
            <NiceSlider images={images} />
            {/* <Image fit="contain" src={activityData.imageUrl} htmlHeight="100%" width="100%" />} */}
          </Box>
        )}
        <Box flexBasis="50%" px="4">
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
                  <Tab __focus={{ boxShadow: 'none' }} textTransform="uppercase">
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
                  <Container px="0" margin={isImage ? 0 : 'auto'}>
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
