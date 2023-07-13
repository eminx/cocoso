import React, { useContext, useState } from 'react';
import { Box, Button, Divider, Flex, Heading, Input, Select, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Search2Icon } from '@chakra-ui/icons/dist/Search2';

import { StateContext } from '../LayoutContainer';
import Drawer from './Drawer';

function FiltrerSorter(props) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDesktop } = useContext(StateContext);
  const [tc] = useTranslation('common');

  return (
    <>
      <Flex justify="flex-end">
        <Button size={isDesktop ? 'sm' : 'xs'} variant="outline" onClick={() => setIsOpen(true)}>
          <Search2Icon mr="2" />
          {tc('labels.filterAndSort')}
        </Button>
      </Flex>
      <Drawer
        hideOverlay
        isOpen={isOpen}
        size="xs"
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
      <Heading fontSize="md">{tc('labels.filter')}:</Heading>
      <Input
        my="4"
        placeholder={tc('domains.props.title') + '...'}
        value={filterWord}
        onChange={(event) => setFilterWord(event.target.value)}
      />
      <Box mb="4">{children}</Box>
      <Divider />
      <Heading fontSize="md" mt="4">
        {tc('labels.sort')}:
      </Heading>
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
