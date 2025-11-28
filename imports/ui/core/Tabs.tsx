import React, { useId, ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';

import { styled } from '/stitches.config';
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
  selected?: boolean;
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
  marginBottom: '1px',
});

const TabsList = ({ alignItems, justify, ...rest }: TabsListProps) => (
  <TabsListStyled
    css={{
      alignItems: alignItems || 'center',
      justifyContent: justify || 'flex-start',
    }}
    {...rest}
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
  },
});

const TabItem = ({ selected, ...rest }: TabItemProps) => (
  <TabItemStyled
    css={{
      borderBottom: `2px solid ${
        selected ? 'var(--cocoso-colors-theme-500)' : 'transparent'
      }`,
      '&:hover': {
        borderBottomColor: selected
          ? 'var(--cocoso-colors-theme-500)'
          : 'var(--cocoso-colors-theme-200)',
        color: 'var(--cocoso-colors-theme-500)',
      },
    }}
    {...rest}
  />
);

const TabLink = styled(Link, {
  color: 'inherit',
  marginBottom: 0,
  textDecoration: 'none',
  '&:hover': {
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
  '&:hover': {
    textDecoration: 'none',
  },
});

interface CoTabProps {
  tab: TabType;
  selected: boolean;
}

const CoTab: React.FC<CoTabProps> = ({ tab, selected }) => {
  const instanceId = useId();
  if (!tab) {
    return null;
  }

  return (
    <TabItem selected={selected} id={instanceId}>
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
  withSearchParams: boolean;
  children?: ReactNode;
}

const Tabs: React.FC<TabsProps> = ({
  index,
  tabs,
  withSearchParams = false,
  children,
  ...otherProps
}) => {
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleClick = (tab: TabType) => {
    if (tab.path) {
      if (withSearchParams) {
        setSearchParams((params) => ({
          ...params,
          tab: tab.path,
        }));
      } else {
        navigate(tab.path);
      }
    }
    if (tab.onClick) {
      tab.onClick();
    }
  };
  return (
    <TabsContainer>
      <TabsList {...otherProps}>
        {tabs?.map((tab, tabIndex) => {
          const selected = tabIndex === index;

          return (
            <TabButton
              key={tab.key || tab.path || tab.title}
              type="button"
              onClick={() => handleClick(tab)}
            >
              <CoTab tab={tab} selected={selected} />
            </TabButton>
          );
        })}
        {children}
      </TabsList>
    </TabsContainer>
  );
};

export default Tabs;
