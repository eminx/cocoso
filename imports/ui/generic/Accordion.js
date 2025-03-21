import * as React from 'react';

import {
  Accordion as ChAccordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

export default function Accordion({ items, ...otherProps }) {
  return (
    <ChAccordion {...otherProps}>
      {items.map((item) => (
        <AccordionItem key={item.value}>
          <AccordionButton variant="unstyled">
            {item.label}
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel>{item.content}</AccordionPanel>
        </AccordionItem>
      ))}
    </ChAccordion>
  );
}
