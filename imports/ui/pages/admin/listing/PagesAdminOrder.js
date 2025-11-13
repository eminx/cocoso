import React, { useEffect, useState } from 'react';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-horizontal';
import { Trans, useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';

import { pageTitlesAtom } from '/imports/state';
import { Box, Button, Flex, Heading, Text } from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';

import Boxling from '../Boxling';

export default function PagesAdminOrder() {
  const [pageTitles, setPageTitles] = useAtom(pageTitlesAtom);
  const [state, setState] = useState({
    pages: pageTitles,
    updating: false,
  });
  const [tc] = useTranslation('common');

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      pages: pageTitles,
    }));
  }, [pageTitles]);

  const handleSortEnd = (oldIndex, newIndex) => {
    setState((prevState) => ({
      ...prevState,
      pages: arrayMoveImmutable(prevState.pages, oldIndex, newIndex).map(
        (page, index) => ({
          ...page,
          order: index + 1,
        })
      ),
    }));
  };

  const savePageOrder = async () => {
    setState((prevState) => ({
      ...prevState,
      updating: true,
    }));
    try {
      await call('savePageOrder', state.pages);
      setPageTitles(await call('getPageTitles'));
      message.success(
        tc('message.success.save', { domain: tc('domains.pageOrder') })
      );
    } catch (error) {
      message.error(error.reason || error.error);
    } finally {
      setState((prevState) => ({
        ...prevState,
        updating: false,
      }));
    }
  };

  const { pages, updating } = state;

  if (!pages || !pages.length) {
    return null;
  }

  return (
    <>
      <Box pb="4">
        <Heading as="h3" size="sm" mt="6" mb="2">
          <Trans i18nKey="admin:pages.order.label" />
        </Heading>
        <Text size="sm">
          <Trans i18nKey="admin:pages.order.info" />
        </Text>
      </Box>

      <Boxling style={{ backgroundColor: 'var(--cocoso-colors-bluegray-50)' }}>
        <SortableList onSortEnd={handleSortEnd}>
          {pages
            .sort((a, b) => a.order - b.order)
            .map((page) => (
              <SortableItem key={page._id}>
                <div>
                  <Flex
                    align="center"
                    bg="white"
                    borderRadius="md"
                    mb="4"
                    px="4"
                    py="2"
                    css={{
                      boxShadow: 'var(--cocoso-box-shadow)',
                      cursor: 'ns-resize',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    <Text fontWeight="bold">{page.order}</Text>
                    <DragHandleIcon />
                    <Text truncated>{page.title}</Text>
                  </Flex>
                </div>
              </SortableItem>
            ))}
        </SortableList>

        <Flex justify="flex-end" py="2">
          <Button isLoading={updating} onClick={savePageOrder}>
            {tc('actions.submit')}
          </Button>
        </Flex>
      </Boxling>
    </>
  );
}
