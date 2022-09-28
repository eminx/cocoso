import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Tabs as CTabs, Tab, TabList } from '@chakra-ui/react';

const parsePath = (path) => {
  const gotoPath = path + '?noScrollTop=true';
  return gotoPath;
};

function Tabs({ tabs, children, ...otherProps }) {
  return (
    <CTabs colorScheme="gray.800" flexShrink="0" mt="2" {...otherProps}>
      <TabList flexWrap="wrap" mb="4" borderBottom="none" ml="2">
        {tabs?.map((tab) => (
          <Link key={tab.title} to={parsePath(tab.path)} style={{ margin: 0 }}>
            <Tab
              as="span"
              _focus={{ boxShadow: 'none' }}
              textTransform="uppercase"
              onClick={tab.onClick}
              pb="0"
              mb="1"
              paddingInline="0"
              marginInline="2"
            >
              {tab.title}
              {tab.badge && (
                <Badge colorScheme="red" size="xs" mt="-2">
                  {tab.badge}
                </Badge>
              )}
            </Tab>
          </Link>
        ))}
        {children}
      </TabList>
    </CTabs>
  );
}

export default Tabs;
