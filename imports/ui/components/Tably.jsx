import React, { useContext } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Box, Flex, Heading, Tabs, Tab, TabList } from '@chakra-ui/react';

import NiceSlider from './NiceSlider';
import { StateContext } from '../LayoutContainer';

function Tably({ tabs, title, subTitle, images }) {
  const history = useHistory();
  const location = useLocation();
  const { isDesktop } = useContext(StateContext);

  const getDefaultTabIndex = () => {
    return tabs.findIndex((tab) => tab.path === location.pathname);
  };

  if (!tabs.find((tab) => tab.path === location.pathname)) {
    return <Redirect to={tabs[0].path} />;
  }

  return (
    <>
      <Heading as="h3" size="lg" textAlign="center" mt="2" mb="2">
        {title}
      </Heading>
      {subTitle && (
        <Heading as="h4" size="md" fontWeight="light" mb="6" textAlign="center">
          {subTitle}
        </Heading>
      )}
      <Flex justify="center" direction={isDesktop ? 'row' : 'column'}>
        {images && images.length > 0 && (
          <Box flexBasis="50%" flexGrow="0" mb="4" w={isDesktop ? '50%' : '100%'}>
            <NiceSlider images={images} />
            {/* <Image fit="contain" src={activityData.imageUrl} htmlHeight="100%" width="100%" />} */}
          </Box>
        )}
        <Box flexBasis="50%" px="4">
          <Tabs
            defaultIndex={getDefaultTabIndex()}
            flexShrink="0"
            size={tabs.length > 3 ? 'sm' : 'md'}
          >
            <TabList mb="4">
              {tabs.map((tab) => (
                <Link key={tab.title} to={tab.path}>
                  <Tab>{tab.title}</Tab>
                </Link>
              ))}
            </TabList>
          </Tabs>

          <Switch history={history}>
            {tabs.map((tab) => (
              <Route key={tab.title} path={tab.path} render={(props) => tab.content} />
            ))}
          </Switch>
        </Box>
      </Flex>
    </>
  );
}

export default Tably;
