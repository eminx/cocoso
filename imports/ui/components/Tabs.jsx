import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Link as CLink, Tabs as CTabs, Tab, TabIndicator, TabList } from '@chakra-ui/react';

const tabProps = {
  // _focus: { boxShadow: 'none' },
  as: 'span',
  bg: 'white',
  // pb: '0',
  paddingInline: '4',
};

const linkStyle = {
  marginBottom: 0,
  // marginRight: 8,
};

function Tabs({ forceUppercase = true, tabs, children, ...otherProps }) {
  return (
    <CTabs colorScheme="gray.800" flexShrink="0" mt="2" variant="unstyled" {...otherProps}>
      <TabList flexWrap="wrap" borderBottom="none" ml="4">
        {tabs?.map((tab) =>
          tab.path ? (
            <Link key={tab.title} to={tab.path} style={linkStyle}>
              <Tab
                {...tabProps}
                bg="purple.200"
                // color="white"
                fontWeight="bold"
                textTransform={forceUppercase ? 'uppercase' : 'normal'}
                onClick={tab.onClick}
                _selected={{
                  bg: 'white',
                }}
                // _hover={{
                //   bg: 'purple.200',
                //   color: 'gray.900',
                // }}
                // _active={{
                //   bg: 'purple.800',
                //   color: 'white',
                // }}
              >
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
