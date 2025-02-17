import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-horizontal';
import { Trans, useTranslation } from 'react-i18next';
import { message } from '../../../generic/message';

import { call } from '../../../utils/shared';

export default function PagesAdmin() {
  const [state, setState] = useState({
    pages: [],
    updating: false,
  });
  const [tc] = useTranslation('common');

  useEffect(() => {
    Meteor.call('getPageTitles', (error, respond) => {
      setState((prevState) => ({
        ...prevState,
        pages: respond,
      }));
    });
  }, []);

  const handleSortEnd = (oldIndex, newIndex) => {
    setState((prevState) => ({
      ...prevState,
      pages: arrayMoveImmutable(prevState.pages, oldIndex, newIndex).map((page, index) => ({
        ...page,
        order: index + 1,
      })),
    }));
  };

  const savePageOrder = async () => {
    setState((prevState) => ({
      ...prevState,
      updating: true,
    }));
    try {
      await call('savePageOrder', state.pages);
      message.success(tc('message.success.save', { domain: tc('domains.pageOrder') }));
    } catch (error) {
      message.error(error.reason || error.error);
    } finally {
      setState((prevState) => ({
        ...prevState,
        updating: false,
      }));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const { pages, updating } = state;

  if (!pages || !pages.length) {
    return null;
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb="4">
        <Trans i18nKey="admin:pages.order.label" />
      </Text>
      <Text mb="4">
        <Trans i18nKey="admin:pages.order.info" />
      </Text>
      <SortableList onSortEnd={handleSortEnd}>
        {pages
          .sort((a, b) => a.order - b.order)
          .map((page) => (
            <SortableItem key={page._id}>
              <Flex
                align="center"
                bg="gray.50"
                borderRadius="lg"
                cursor="move"
                boxShadow="md"
                mb="4"
                p="2"
                style={{ fontFamily: 'Sarabun, sans-serif' }}
              >
                <Text fontWeight="bold" mr="4">
                  {page.order}
                </Text>
                <DragHandleIcon /> <Text ml="2">{page.title}</Text>
              </Flex>
            </SortableItem>
          ))}
      </SortableList>

      <Flex justify="flex-end" py="2">
        <Button isLoading={updating} onClick={savePageOrder}>
          {tc('actions.submit')}
        </Button>
      </Flex>
    </Box>
  );
}
