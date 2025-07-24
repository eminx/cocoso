import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import ListFilter from 'lucide-react/dist/esm/icons/list-filter';

import {
  Accordion,
  Box,
  Button,
  Flex,
  Input,
  Select,
  Text,
} from '/imports/ui/core';

function Inputs({ filterValue, setFilterValue, sortValue, setSortValue }) {
  return (
    <Flex justify="space-between" w="100">
      <Box>
        <Text fontSize="xs">
          <Trans i18nKey="labels.filter" ns="common">
            Filter
          </Trans>
        </Text>
        <Input
          size="sm"
          value={filterValue}
          css={{ margin: '0.5rem 0' }}
          onChange={(event) => setFilterValue(event.target.value)}
        />
      </Box>

      <Box>
        <Text fontSize="xs">
          <Trans i18nKey="labels.sort" ns="common">
            Sort
          </Trans>
        </Text>
        <Select
          name="sorter"
          size="sm"
          value={sortValue}
          css={{ margin: '0.5rem 0' }}
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
    </Flex>
  );
}

export default function FiltrerSorter(props) {
  const { open, setOpen } = useState();

  const handleToggle = () => {
    if (open) {
      props.setFilterValue('');
    }
    setOpen(!open);
  };

  return (
    <Flex justify="flex-end" my="2" w="300px">
      <Accordion
        options={[
          {
            key: '1',
            header: (
              <Flex align="center" w="100%">
                <ListFilter />
                <span style={{ fontSize: '0.875rem' }}>
                  <Trans i18nKey="common:labels.filterAndSort">
                    Filter & Sort
                  </Trans>
                </span>
              </Flex>
            ),
            content: (
              <Box>
                <Inputs {...props} />
              </Box>
            ),
          },
        ]}
      />
    </Flex>
  );
}
