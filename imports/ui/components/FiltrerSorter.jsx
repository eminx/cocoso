import React, { useContext } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Center,
  Flex,
  Input,
  Link,
  Select,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';

function FiltrerSorter(props) {
  const { isDesktop } = useContext(StateContext);
  const [tc] = useTranslation('common');

  if (isDesktop) {
    return (
      <Box mb="2" px="1">
        <Inputs {...props} isDesktop={isDesktop} tc={tc} />
        <Box px="2">
          <Text fontSize="sm" mb="1" mt="1">
            {tc('labels.filterAndSort')}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Accordion px="2" w={isDesktop ? '2xl' : '100%'} allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Link as="span">{tc('labels.filterAndSort')}</Link>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Inputs {...props} isDesktop={isDesktop} tc={tc} />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function Inputs({
  filterWord,
  setFilterWord,
  sorterValue,
  setSorterValue,
  tc,
  isDesktop,
  children,
}) {
  return (
    <Flex align="center" justify="flex-start" wrap={isDesktop ? 'nowrap' : 'wrap'}>
      <Input
        flexBasis="180px"
        mb={isDesktop ? '0' : '2'}
        mx="1"
        placeholder={tc('domains.props.title') + '...'}
        value={filterWord}
        onChange={(event) => setFilterWord(event.target.value)}
      />
      {children}
      <Select
        flexBasis="180px"
        mb={isDesktop ? '0' : '2'}
        mx={isDesktop ? '2' : '1'}
        name="sorter"
        value={sorterValue}
        onChange={(e) => setSorterValue(e.target.value)}
      >
        <option value="date">{tc('labels.sortBy.date')}</option>
        <option value="name">{tc('labels.sortBy.name')}</option>
      </Select>
    </Flex>
  );
}

export default FiltrerSorter;
