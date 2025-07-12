import React from 'react';
import { styled, GlobalStyles } from 'restyle';
import {
  Accordion as SzAccordion,
  AccordionProps as SzAccordionProps,
  AccordionItem as SzAccordionItem,
  AccordionItemProps,
} from '@szhsin/react-accordion';
import ChevronIcon from 'lucide-react/dist/esm/icons/chevron-down';

import { Flex } from './Box';

interface AccordionProps extends SzAccordionProps {
  options: {
    key: string;
    header: React.ReactNode;
    content: React.ReactNode;
  }[];
}

const AccordionItem = styled(
  SzAccordionItem,
  (props: AccordionItemProps) => ({
    borderRadius: 'var(--cocoso-border-radius)',
    color: 'var(--cocoso-colors-gray-900)',
    width: '100%',
  })
);

const Chevron = styled(ChevronIcon, (props: { isEnter: boolean }) => ({
  color: props.isEnter ? 'white' : 'var(--cocoso-colors-gray-900)',
  transition: 'transform 0.25s ease-in-out',
  transform: props.isEnter ? 'rotate(180deg)' : 'rotate(0deg)',
}));

const Accordion = ({ options, ...props }: AccordionProps) => {
  return (
    <>
      <GlobalStyles>
        {{
          '.szh-accordion__item-btn': {
            backgroundColor: 'var(--cocoso-colors-theme-100)',
            borderRadius: 'var(--cocoso-border-radius)',
            color: 'var(--cocoso-colors-gray-900)',
            margin: '0.5rem 0',
            padding: '1rem',
            width: '100%',
          },
          '.szh-accordion__item-btn:hover': {
            backgroundColor: 'var(--cocoso-colors-theme-200)',
          },
          '.szh-accordion__item-content': {
            backgroundColor: 'var(--cocoso-colors-theme-100)',
            borderRadius: 'var(--cocoso-border-radius)',
            padding: '1rem',
            transition: 'height 0.25s cubic-bezier(0, 0, 0, 1)',
          },
          '.szh-accordion__item--expanded .szh-accordion__item-btn': {
            backgroundColor: 'var(--cocoso-colors-theme-500)',
            color: 'white',
          },
        }}
      </GlobalStyles>
      <SzAccordion transition transitionTimeout={250} {...props}>
        {options.map((item) => (
          <AccordionItem
            key={item.key}
            header={({ state }) => (
              <Flex align="center" justify="space-between">
                {item.header} <Chevron isEnter={state.isEnter} />
              </Flex>
            )}
          >
            {item.content}
          </AccordionItem>
        ))}
      </SzAccordion>
    </>
  );
};

export { Accordion, AccordionItem };
