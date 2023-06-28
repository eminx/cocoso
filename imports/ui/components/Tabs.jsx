import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Link as CLink, Tabs as CTabs, Tab, TabIndicator, TabList } from '@chakra-ui/react';
import { StateContext } from '../LayoutContainer';

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
  const { hue } = useContext(StateContext);
  const backgroundColor = hue ? `hsl(${hue}deg, 60%, 95%)` : 'gray.400';
  const hoverColor = hue ? `hsl(${hue}deg, 60%, 90%)` : 'gray.100';
  const activeColor = hue ? `hsl(${hue}deg, 60%, 80%)` : 'gray.200';
  const color = hue ? `hsl(${hue}deg, 50%, 30%)` : 'blue.700';

  return (
    <CTabs colorScheme="gray.800" flexShrink="0" mt="2" variant="unstyled" {...otherProps}>
      <TabList flexWrap="wrap" borderBottom="none">
        {tabs?.map((tab) =>
          tab.path ? (
            <Link key={tab.title} to={tab.path} style={linkStyle}>
              <Tab
                {...tabProps}
                bg={backgroundColor}
                color={color}
                fontWeight="bold"
                textTransform={forceUppercase ? 'uppercase' : 'normal'}
                onClick={tab.onClick}
                _active={{
                  bg: activeColor,
                }}
                _hover={{
                  bg: hoverColor,
                }}
                _selected={{
                  bg: 'white',
                  color: 'gray.800',
                  cursor: 'default',
                }}
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
