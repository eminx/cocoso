import React, { useState } from 'react';
import ChevronIcon from 'lucide-react/dist/esm/icons/chevron-down';
import { styled } from '/stitches.config';

import { Flex } from './Box';

interface AccordionOption {
  key: string;
  header: React.ReactNode;
  content: React.ReactNode;
}

interface AccordionProps {
  options: AccordionOption[];
  allowMultiple?: boolean;
}

const ChevronStyled = styled(ChevronIcon, {
  flexShrink: 0,
  transition: 'transform 0.25s ease-in-out',
});

const ContentWrapper = styled('div', {
  display: 'grid',
  transition: 'grid-template-rows 0.25s ease-in-out',
  variants: {
    open: {
      true: { gridTemplateRows: '1fr' },
      false: { gridTemplateRows: '0fr' },
    },
  },
  defaultVariants: {
    open: false,
  },
});

const ContentInner = styled('div', {
  overflow: 'hidden',
});

function AccordionItem({
  option,
  isOpen,
  onToggle,
}: {
  option: AccordionOption;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderRadius: 'var(--cocoso-border-radius)',
        color: 'var(--cocoso-colors-gray-900)',
        width: '100%',
      }}
    >
      <button
        className={`szh-accordion__item-btn${isOpen ? ' szh-accordion__item-btn--open' : ''}`}
        type="button"
        onClick={onToggle}
      >
        <Flex align="center" justify="space-between">
          {option.header}
          <ChevronStyled
            css={{
              color: isOpen ? 'white' : 'var(--cocoso-colors-gray-900)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Flex>
      </button>
      <ContentWrapper open={isOpen}>
        <ContentInner>
          <div className="szh-accordion__item-content">{option.content}</div>
        </ContentInner>
      </ContentWrapper>
    </div>
  );
}

const Accordion = ({ options, allowMultiple = false }: AccordionProps) => {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        if (!allowMultiple) next.clear();
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="szh-accordion">
      {options.map((option) => (
        <AccordionItem
          key={option.key}
          option={option}
          isOpen={openKeys.has(option.key)}
          onToggle={() => toggle(option.key)}
        />
      ))}
    </div>
  );
};

export { Accordion, AccordionItem };
