import React, { useContext, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Input,
  Link,
  Select,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Search2Icon } from '@chakra-ui/icons/dist/Search2';

import { StateContext } from '../LayoutContainer';
import Drawer from './Drawer';

function FiltrerSorter(props) {
  const [isOpen, setIsOpen] = useState(false);
  const { hue, isDesktop } = useContext(StateContext);
  const [tc] = useTranslation('common');

  const backgroundColor = hue ? `hsl(${hue}deg, 50%, 50%)` : 'gray.600';
  const hoverColor = hue ? `hsl(${hue}deg, 50%, 55%)` : 'gray.500';
  const activeColor = hue ? `hsl(${hue}deg, 50%, 40%)` : 'gray.700';
  const color = hue ? `hsl(${hue}deg, 50%, 95%)` : 'white';

  return (
    <>
      <Flex w="100%" justify="flex-end">
        <Button
          _active={{ backgroundColor: activeColor }}
          _hover={{ backgroundColor: hoverColor }}
          bg={backgroundColor}
          color={color}
          mb="4"
          size="sm"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          <Search2Icon mr="2" />
          {tc('labels.filterAndSort')}
        </Button>
      </Flex>
      <Drawer
        colorScheme="cyan"
        isOpen={isOpen}
        size="sm"
        title={tc('labels.filterAndSort')}
        onClose={() => setIsOpen(false)}
      >
        <Inputs {...props} isDesktop={isDesktop} tc={tc} />
      </Drawer>
    </>
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
    <Flex
      align="flex-start"
      direction="column"
      justify="flex-start"
      wrap={isDesktop ? 'nowrap' : 'wrap'}
    >
      <Input
        my="4"
        placeholder={tc('domains.props.title') + '...'}
        value={filterWord}
        onChange={(event) => setFilterWord(event.target.value)}
      />
      {children}
      <Select
        my="4"
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
