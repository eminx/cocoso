import React, { useId } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'restyle';

import { Badge, Box, Flex, Text } from '/imports/ui/core';

// Styled components
const TabsContainer = styled('div', {
  position: 'relative',
  top: '1px',
});

const TabsList = styled('div', (props) => ({
  display: 'flex',
  alignItems: props.alignItems || 'center',
  flexShrink: '0',
  justifyContent: props.justify || 'flex-start',
  flexDirection: 'row',
  borderBottom: '1px solid #e2e8f0',
}));

const TabItem = styled('div', (props) => ({
  borderBottom: `2px solid ${
    props.isSelected ? 'var(--chakra-colors-brand-500)' : 'transparent'
  }`,
  color: 'var(--chakra-colors-gray-700)',
  cursor: 'pointer',
  display: 'inline-flex',
  justifyContent: 'flex-start',
  paddingInline: '1rem',
  paddingBlock: '0.5rem',
  transition: 'border-color 0.2s, color 0.2s',
  ':hover': {
    borderBottomColor: props.isSelected
      ? 'var(--chakra-colors-brand-500)'
      : 'var(--chakra-colors-brand-200)',
    color: 'var(--chakra-colors-brand-500)',
  },
  ':focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px var(--chakra-colors-brand-200)',
  },
}));

const TabLink = styled(Link, {
  color: 'inherit',
  marginBottom: 0,
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'none',
  },
});

const TabButton = styled('button', {
  background: 'none',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  marginBottom: 0,
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'none',
  },
});

function CoTab({ tab, isSelected }) {
  const instanceId = useId();
  if (!tab) {
    return null;
  }

  return (
    <TabItem isSelected={isSelected} id={instanceId}>
      <Flex
        css={{
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Text
          css={{
            fontWeight: 'bold',
          }}
        >
          {tab.title}
        </Text>
        {tab.badge && (
          <Badge variant="solid" colorScheme="red" size="xs">
            {tab.badge}
          </Badge>
        )}
      </Flex>
    </TabItem>
  );
}

function Tabs({ index, tabs, children, ...otherProps }) {
  return (
    <TabsContainer>
      <TabsList {...otherProps}>
        {tabs?.map((tab, tabIndex) => {
          const isSelected = tabIndex === index;

          if (tab.path) {
            return (
              <TabLink
                key={tab.key || tab.path}
                to={tab.path}
                onClick={tab.onClick}
              >
                <CoTab tab={tab} isSelected={isSelected} />
              </TabLink>
            );
          } else {
            return (
              <TabButton
                key={tab.key || tab.title}
                onClick={tab.onClick}
              >
                <CoTab tab={tab} isSelected={isSelected} />
              </TabButton>
            );
          }
        })}
        {children}
      </TabsList>
    </TabsContainer>
  );
}

export default Tabs;
