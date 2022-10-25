import React, { useContext } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  Input,
  Link,
  Select,
} from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';

function FiltrerSorter({ filterWord, setFilterWord, sorterValue, setSorterValue, children }) {
  const { isDesktop } = useContext(StateContext);

  return (
    <Accordion w="xl" allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Link as="span">Filter & Sort</Link>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Flex
            align="center"
            justify={isDesktop ? 'space-between' : 'center'}
            wrap={isDesktop ? 'nowrap' : 'wrap'}
          >
            <Input
              flexBasis="150px"
              placeholder={'type something'}
              size="sm"
              value={filterWord}
              onChange={(event) => setFilterWord(event.target.value)}
            />
            {children}
            <Select
              flexBasis="150px"
              name="sorter"
              size="sm"
              value={sorterValue}
              onChange={(e) => setSorterValue(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
            </Select>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default FiltrerSorter;
