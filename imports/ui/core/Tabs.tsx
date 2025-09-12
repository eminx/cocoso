import React, { useId, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@stitches/react';

import { Badge, Flex, Text } from '/imports/ui/core';

// Tab type definition
export interface TabType {
  key?: string;
  path?: string;
  title: string;
  badge?: ReactNode;
  onClick?: () => void;
}

// Styled components
type TabsListProps = {
  alignItems?: string;
  justify?: string;
  children?: ReactNode;
};

type TabItemProps = {
  isSelected?: boolean;
  children?: ReactNode;
  id?: string;
};

const TabsContainer = styled('div', {
  position: 'relative',
  top: '1px',
});

const TabsListStyled = styled('div', {
  display: 'flex',
  flexShrink: '0',
  flexDirection: 'row',
  // borderBottom: '1px solid #e2e8f0',
});

const TabsList = (props: TabsListProps) => (
  <TabsListStyled
    css={{
      alignItems: props.alignItems || 'center',
      justifyContent: props.justify || 'flex-start',
    }}
  />
);

const TabItemStyled = styled('div', {
  color: 'var(--cocoso-colors-gray-700)',
  cursor: 'pointer',
  display: 'inline-flex',
  justifyContent: 'flex-start',
  paddingInline: '1rem',
  paddingBlock: '0.5rem',
  transition: 'border-color 0.2s, color 0.2s',
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px var(--cocoso-colors-theme-200)',
  },
});

const TabItem = (props: TabItemProps) => (
  <TabItemStyled
    css={{
      borderBottom: `2px solid ${
        props.isSelected ? 'var(--cocoso-colors-theme-500)' : 'transparent'
      }`,
      '&:hover': {
        borderBottomColor: props.isSelected
          ? 'var(--cocoso-colors-theme-500)'
          : 'var(--cocoso-colors-theme-200)',
        color: 'var(--cocoso-colors-theme-500)',
      },
    }}
  />
);

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

interface CoTabProps {
  tab: TabType;
  isSelected: boolean;
}

const CoTab: React.FC<CoTabProps> = ({ tab, isSelected }) => {
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
          <Badge variant="solid" colorScheme="red" size="sm">
            {tab.badge}
          </Badge>
        )}
      </Flex>
    </TabItem>
  );
};

interface TabsProps extends TabsListProps {
  index: number;
  tabs: TabType[];
  children?: ReactNode;
}

const Tabs: React.FC<TabsProps> = ({
  index,
  tabs,
  children,
  ...otherProps
}) => {
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
              <TabButton key={tab.key || tab.title} onClick={tab.onClick}>
                <CoTab tab={tab} isSelected={isSelected} />
              </TabButton>
            );
          }
        })}
        {children}
      </TabsList>
    </TabsContainer>
  );
};

export default Tabs;
