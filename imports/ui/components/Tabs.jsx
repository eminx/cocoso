import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Link as CLink, Tabs as CTabs, Tab, TabList } from '@chakra-ui/react';

const tabProps = {
  as: 'span',
  _focus: { boxShadow: 'none' },
  textTransform: 'uppercase',
  pb: '0',
  paddingInline: '0',
};

const linkStyle = {
  marginBottom: 4,
  marginInline: 8,
};

function Tabs({ tabs, children, ...otherProps }) {
  return (
    <CTabs colorScheme="gray.800" flexShrink="0" mt="2" {...otherProps}>
      <TabList flexWrap="wrap" mb="4" borderBottom="none" ml="2">
        {tabs?.map((tab) =>
          tab.path ? (
            <Link key={tab.title} to={tab.path} style={linkStyle}>
              <Tab {...tabProps} onClick={tab.onClick}>
                {tab.title}
                {tab.badge && (
                  <Badge colorScheme="red" size="xs" mt="-2">
                    {tab.badge}
                  </Badge>
                )}
              </Tab>
            </Link>
          ) : (
            <CLink key={tab.title} style={linkStyle} _hover={{ textDecoration: 'none' }}>
              <Tab {...tabProps} onClick={tab.onClick}>
                {tab.title}
                {tab.badge && (
                  <Badge colorScheme="red" size="xs" mt="-2">
                    {tab.badge}
                  </Badge>
                )}
              </Tab>
            </CLink>
          )
        )}
        {children}
      </TabList>
    </CTabs>
  );
}

export default Tabs;
