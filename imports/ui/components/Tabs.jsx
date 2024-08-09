import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, Link as CLink, Tabs as CTabs, Tab, TabList } from '@chakra-ui/react';

const linkStyle = {
  marginBottom: 0,
};

function Tabs({ tabs, size = 'sm', children, ...otherProps }) {
  return (
    <Box position="relative" top="1px" mb="2">
      <CTabs flexShrink="0" size={size} variant="soft-rounded" {...otherProps}>
        <TabList flexWrap="wrap" borderBottom="none">
          {tabs?.map((tab, index) =>
            tab.path ? (
              <Link key={tab.title} to={tab.path} style={linkStyle} onClick={tab.onClick}>
                <CoTab index={index} tab={tab} />
              </Link>
            ) : (
              <CLink
                key={tab.title}
                _hover={{ textDecoration: 'none' }}
                style={linkStyle}
                onClick={tab.onClick}
              >
                <CoTab tab={tab} />
              </CLink>
            )
          )}
          {children}
        </TabList>
      </CTabs>
    </Box>
  );
}

const tabProps = {
  _active: {
    bg: 'brand.50',
  },
  _hover: {
    bg: 'brand.50',
  },
  _focus: {
    boxShadow: 'none',
  },
  _selected: {
    bg: 'brand.500',
    color: 'white',
    cursor: 'default',
  },
  as: 'span',
  bg: 'white',
  fontFamily: "'Sarabun', sans-serif",
  fontWeight: 'bold',
  justifyContent: 'flex-start',
  paddingInline: '4',
};

function CoTab({ index, tab }) {
  if (!tab) {
    return null;
  }

  return (
    <Tab
      {...tabProps}
      borderTop="1px solid"
      borderRight="1px solid"
      borderBottom="1px solid"
      borderLeft={index === 0 ? '1px solid' : '0.5px solid'}
      borderColor="brand.500"
      color="brand.500"
      mb="2"
      mr="2"
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
