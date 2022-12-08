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
import { useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';

function FiltrerSorter({ filterWord, setFilterWord, sorterValue, setSorterValue, children }) {
  const { isDesktop } = useContext(StateContext);
  const [tc] = useTranslation('common');

  return (
    <Accordion w="2xl" allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Link as="span">{tc('labels.filterAndSort')}</Link>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Flex
            align="center"
            justify={isDesktop ? 'space-between' : 'space-around'}
            wrap={isDesktop ? 'nowrap' : 'wrap'}
          >
            <Input
              flexBasis="180px"
              mb="1"
              placeholder={tc('domains.props.title') + '...'}
              value={filterWord}
              onChange={(event) => setFilterWord(event.target.value)}
            />
            {children}
            <Select
              flexBasis="180px"
              name="sorter"
              value={sorterValue}
              onChange={(e) => setSorterValue(e.target.value)}
            >
              <option value="date">{tc('labels.sortBy.date')}</option>
              <option value="name">{tc('labels.sortBy.name')}</option>
            </Select>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default FiltrerSorter;
