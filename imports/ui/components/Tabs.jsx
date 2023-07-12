import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Link as CLink, Tabs as CTabs, Tab, TabIndicator, TabList } from '@chakra-ui/react';

const linkStyle = {
  marginBottom: 0,
};

function Tabs({ forceUppercase = true, tabs, children, ...otherProps }) {
  return (
    <CTabs flexShrink="0" mt="2" variant="unstyled" {...otherProps}>
      <TabList flexWrap="wrap" borderBottom="none">
        {tabs?.map((tab) =>
          tab.path ? (
            <Link key={tab.title} to={tab.path} style={linkStyle}>
              <CoTab forceUppercase={forceUppercase} tab={tab} />
            </Link>
          ) : (
            <CLink key={tab.title} style={linkStyle} _hover={{ textDecoration: 'none' }}>
              <CoTab forceUppercase={forceUppercase} tab={tab} />
            </CLink>
          )
        )}
        {children}
      </TabList>
    </CTabs>
  );
}

function CoTab({ forceUppercase = true, tab }) {
  if (!tab) {
    return null;
  }

  const tabProps = {
    _active: {
      bg: 'brand.200',
    },
    _hover: {
      bg: 'brand.200',
    },
    _focus: {
      boxShadow: 'none',
    },
    _selected: {
      bg: 'white',
      color: 'gray.800',
      cursor: 'default',
    },
    as: 'span',
    bg: 'white',
    fontFamily: "'Raleway', sans-serif",
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    paddingInline: '4',
  };

  return (
    <Tab
      {...tabProps}
      bg="brand.100"
      color="brand.600"
      textTransform={forceUppercase ? 'uppercase' : 'normal'}
    >
      {tab.title}
      {tab.badge && (
        <Badge colorScheme="red" size="xs" mt="-2">
          {tab.badge}
        </Badge>
      )}
    </Tab>
  );
}

export default Tabs;
