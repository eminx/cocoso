import React, { useContext } from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Select,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
// import { ArrowUpNarrowWide, Search } from 'lucide-react';

import { StateContext } from '../LayoutContainer';

function FiltrerSorter(props) {
  const { isDesktop } = useContext(StateContext);
  const [tc] = useTranslation('common');

  return (
    <Center position="relative" mt="4" w="100px" zIndex="2">
      <Menu placement="bottom">
        <MenuButton
          as={Button}
          bg="white"
          p="1"
          size="xs"
          style={{ position: 'absolute', bottom: '6px' }}
          variant="link"
        >
          {/* <Flex bg="white" justify="center">
            <ArrowUpNarrowWide size="20px" />
            <Search size="20px" />
          </Flex> */}
          <Text>{tc('labels.filterAndSort')}</Text>
        </MenuButton>
        <MenuList bg="brand.50" p="4" border="1px solid #aaa">
          <Inputs {...props} isDesktop={isDesktop} tc={tc} />
        </MenuList>
      </Menu>
    </Center>
  );
}

function Inputs({
  filterWord,
  isDesktop,
  setFilterWord,
  sorterValue,
  setSorterValue,
  tc,
  children,
}) {
  return (
    <Flex align="flex-start" direction="column" justify="flex-start">
      <Heading fontSize="sm">{tc('labels.filter')}:</Heading>
      <Input
        my="2"
        placeholder={tc('domains.props.title') + '...'}
        size="sm"
        value={filterWord}
        onChange={(event) => setFilterWord(event.target.value)}
      />
      <Box>{children}</Box>
      <Divider />
      <Heading fontSize="sm" mt="4">
        {tc('labels.sort')}:
      </Heading>
      <Select
        my="2"
        name="sorter"
        size="sm"
        value={sorterValue}
        onChange={(e) => setSorterValue(e.target.value)}
      >
        <option value="date">{tc('labels.sortBy.date')}</option>
        <option value="name">{tc('labels.sortBy.name')}</option>
        {/* <option value="random">{tc('labels.sortBy.random')}</option> */}
      </Select>
    </Flex>
  );
}

export default FiltrerSorter;
