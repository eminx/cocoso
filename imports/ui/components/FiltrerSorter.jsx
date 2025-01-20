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

import { StateContext } from '../LayoutContainer';

function FiltrerSorter(props) {
  const { isDesktop } = useContext(StateContext);
  const [tc] = useTranslation('common');

  return (
    <Center position="relative" mt="4" w="100px" zIndex="2" data-oid="z22arxw">
      <Menu placement="bottom" data-oid="m0a-vwn">
        <MenuButton
          as={Button}
          bg="#fff"
          size="xs"
          style={{ position: 'absolute', bottom: '8px' }}
          variant="link"
          w="120px"
          data-oid="ikxnn69"
        >
          {/* <Flex bg="white" justify="center">
             <ArrowUpNarrowWide size="20px" />
             <Search size="20px" />
            </Flex> */}
          <Text data-oid="4c5si9d">{tc('labels.filterAndSort')}</Text>
        </MenuButton>
        <MenuList bg="brand.50" p="4" border="1px solid #aaa" data-oid="6pc6:tc">
          <Inputs {...props} isDesktop={isDesktop} tc={tc} data-oid="7oimnxg" />
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
    <Flex align="flex-start" direction="column" justify="flex-start" data-oid="mjpnw.s">
      <Heading fontSize="sm" data-oid="lcd4d:c">
        {tc('labels.filter')}:
      </Heading>
      <Input
        my="2"
        placeholder={tc('domains.props.title') + '...'}
        size="sm"
        value={filterWord}
        onChange={(event) => setFilterWord(event.target.value)}
        data-oid="iqpst_o"
      />

      <Box data-oid="_k7g5sp">{children}</Box>
      <Divider data-oid="xjq32zx" />
      <Heading fontSize="sm" mt="4" data-oid="9bgxlrd">
        {tc('labels.sort')}:
      </Heading>
      <Select
        my="2"
        name="sorter"
        size="sm"
        value={sorterValue}
        onChange={(e) => setSorterValue(e.target.value)}
        data-oid="7hwmzt8"
      >
        <option value="date" data-oid="cmknbxd">
          {tc('labels.sortBy.date')}
        </option>
        <option value="name" data-oid=".xlckrx">
          {tc('labels.sortBy.name')}
        </option>
        {/* <option value="random">{tc('labels.sortBy.random')}</option> */}
      </Select>
    </Flex>
  );
}

export default FiltrerSorter;
