import React, { useContext, useEffect, useState } from 'react';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-horizontal';
import { Trans, useTranslation } from 'react-i18next';

import { message } from '../../../generic/message';
import { call } from '../../../utils/shared';
import { StateContext } from '../../../LayoutContainer';
import Boxling from '../Boxling';

export default function PagesAdminOrder() {
  const { pageTitles, getPageTitles } = useContext(StateContext);
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
      await getPageTitles();
      message.success(tc('message.success.save', { domain: tc('domains.pageOrder') }));
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
      <Heading as="h3" size="sm" mt="6" mb="2">
        <Trans i18nKey="admin:pages.order.label" />
      </Heading>
      <Text fontSize="sm" mb="4">
        <Trans i18nKey="admin:pages.order.info" />
      </Text>

      <Boxling>
        <SortableList onSortEnd={handleSortEnd}>
          {pages
            .sort((a, b) => a.order - b.order)
            .map((page) => (
              <SortableItem key={page._id}>
                <Flex
                  align="center"
                  bg="white"
                  borderRadius="lg"
                  boxShadow="md"
                  cursor="move"
                  mb="4"
                  px="4"
                  py="2"
                  style={{ fontFamily: 'Sarabun, sans-serif' }}
                >
                  <Text fontWeight="bold" mr="4">
                    {page.order}
                  </Text>
                  <DragHandleIcon />
                  <Text isTruncated ml="2">
                    {page.title}
                  </Text>
                </Flex>
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
