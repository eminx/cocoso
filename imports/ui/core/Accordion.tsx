import React from 'react';
import {
  Accordion as SzAccordion,
  AccordionProps as SzAccordionProps,
  AccordionItem as SzAccordionItem,
  AccordionItemProps,
} from '@szhsin/react-accordion';
import ChevronIcon from 'lucide-react/dist/esm/icons/chevron-down';
import { styled } from '@stitches/react';

import { Flex } from './Box';

interface AccordionProps extends SzAccordionProps {
  options: {
    key: string;
    header: React.ReactNode;
    content: React.ReactNode;
  }[];
}

const AccordionItem = (props: AccordionItemProps) => (
  <SzAccordionItem
    {...props}
    style={{
      borderRadius: 'var(--cocoso-border-radius)',
      color: 'var(--cocoso-colors-gray-900)',
      width: '100%',
    }}
  />
);

const ChevronStyled = styled(ChevronIcon, {
  transition: 'transform 0.25s ease-in-out',
});

const Chevron = ({ isEnter }: { isEnter: boolean }) => (
  <ChevronStyled
    css={{
      color: isEnter ? 'white' : 'var(--cocoso-colors-gray-900)',
      transform: isEnter ? 'rotate(180deg)' : 'rotate(0deg)',
    }}
  />
);

const Accordion = ({ options, ...props }: AccordionProps) => {
  return (
    <SzAccordion transition transitionTimeout={250} {...props}>
      {options.map((item) => (
        <AccordionItem
          key={item.key}
          header={({ state }: { state: { isEnter: boolean } }) => (
            <Flex align="center" justify="space-between">
              {item.header} <Chevron isEnter={state.isEnter} />
            </Flex>
          )}
        >
          {item.content}
        </AccordionItem>
      ))}
    </SzAccordion>
  );
};

export { Accordion, AccordionItem };
