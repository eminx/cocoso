import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Link as CLink, Tabs as CTabs, Tab, TabIndicator, TabList } from '@chakra-ui/react';
import { StateContext } from '../LayoutContainer';

const linkStyle = {
  marginBottom: 0,
};

function Tabs({ forceUppercase = true, tabs, children, ...otherProps }) {
  const { hue } = useContext(StateContext);
  const activeColor = hue ? `hsl(${hue}deg, 60%, 80%)` : 'gray.200';
  const backgroundColor = hue ? `hsl(${hue}deg, 60%, 95%)` : 'gray.400';
  const color = hue ? `hsl(${hue}deg, 50%, 30%)` : 'blue.700';
  const hoverColor = hue ? `hsl(${hue}deg, 60%, 90%)` : 'gray.100';

  const dynamicTabProps = {
    activeColor,
    backgroundColor,
    color,
    forceUppercase,
    hoverColor,
    hue,
  };

  return (
    <CTabs colorScheme="gray.800" flexShrink="0" mt="2" variant="unstyled" {...otherProps}>
      <TabList flexWrap="wrap" borderBottom="none">
        {tabs?.map((tab) =>
          tab.path ? (
            <Link key={tab.title} to={tab.path} style={linkStyle}>
              <CoTab {...dynamicTabProps} tab={tab} />
            </Link>
          ) : (
            <CLink key={tab.title} style={linkStyle} _hover={{ textDecoration: 'none' }}>
              <CoTab {...dynamicTabProps} tab={tab} />
            </CLink>
          )
        )}
        {children}
      </TabList>
    </CTabs>
  );
}

function CoTab({ activeColor, backgroundColor, color, forceUppercase, hoverColor, tab }) {
  if (!tab) {
    return null;
  }

  const tabProps = {
    _active: {
      bg: activeColor,
    },
    _hover: {
      bg: hoverColor,
    },
    _focus: {
      boxShadow: 'none',
    },
    _selected: {
      bg: color,
      color: 'white',
      cursor: 'default',
    },
    as: 'span',
    bg: 'white',
    fontWeight: 'bold',
    paddingInline: '4',
  };

  return (
    <Tab
      {...tabProps}
      bg={backgroundColor}
      color={color}
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
