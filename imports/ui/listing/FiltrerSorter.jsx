import React from 'react';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Input,
  Select,
  Wrap,
  useDisclosure,
} from '@chakra-ui/react';
import { Trans, useTranslation } from 'react-i18next';
import ListFilter from 'lucide-react/dist/esm/icons/list-filter';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';

function Inputs({ filterValue, setFilterValue, sortValue, setSortValue }) {
  const [tc] = useTranslation('common');

  return (
    <Wrap justify="space-around">
      <Box w="2xs" px="4">
        <Heading fontSize="sm">
          <Trans i18nKey="labels.filter" ns="common">
            Filter
          </Trans>
        </Heading>
        <Input
          my="2"
          placeholder={tc('domains.props.title')}
          size="sm"
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
        />
      </Box>

      <Box w="2xs" px="4">
        <Heading fontSize="sm">
          <Trans i18nKey="labels.sort" ns="common">
            Sort:
          </Trans>
        </Heading>
        <Select
          my="2"
          name="sorter"
          size="sm"
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
        >
          <option value="date">
            <Trans i18nKey="labels.sortBy.date" ns="common">
              Date
            </Trans>
          </option>
          <option value="name">
            <Trans i18nKey="labels.sortBy.name" ns="common">
              Name
            </Trans>
          </option>
          {/* <option value="random">{tc('labels.sortBy.random')}</option> */}
        </Select>
      </Box>
    </Wrap>
  );
}

export default function FiltrerSorter(props) {
  const { isOpen, onToggle } = useDisclosure();

  const handleToggle = () => {
    if (isOpen) {
      props.setFilterValue('');
    }
    onToggle();
  };

  return (
    <Box>
      <Flex justify="flex-end">
        <Button
          fontWeight="normal"
          leftIcon={<ListFilter />}
          mb="2"
          rightIcon={isOpen ? <ChevronUp size={18} /> : <ChevronDown size={15} />}
          size="xs"
          variant="ghost"
          onClick={() => handleToggle()}
        >
          <Trans i18nKey="common:labels.filterAndSort">Filter & Sort</Trans>
        </Button>
      </Flex>

      <Box>
        <Collapse in={isOpen} animateOpacity>
          <Box
            bg="gray.50"
            borderColor="brand.200"
            borderWidth={1}
            borderRadius={8}
            mb="4"
            mx="2"
            p="4"
          >
            <Inputs {...props} />
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
