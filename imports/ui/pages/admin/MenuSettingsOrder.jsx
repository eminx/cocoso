import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import SortableList, { SortableItem } from 'react-easy-sort';
import ReactSelect from 'react-select';
import { arrayMoveImmutable } from 'array-move';
import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-horizontal';
import XIcon from 'lucide-react/dist/esm/icons/x';
import { useAtom } from 'jotai';

import { currentHostAtom } from '/imports/state';
import { updateHostSettings } from '/imports/actions';
import { Box, Button, Flex, Heading, IconButton, Text } from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';

import Boxling from './Boxling';

export default function MenuSettingsOrder({ Host }) {
  const [currentHost, setCurrentHost] = useAtom(currentHostAtom);
  const [localMenu, setLocalMenu] = useState(currentHost?.settings?.menu);
  const [composablePageTitles, setComposablePageTitles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const getComposablePageTitles = async () => {
    const response = await call('getComposablePageTitles');
    setComposablePageTitles(response);
  };

  useEffect(() => {
    if (!currentHost) {
      return;
    }
    getComposablePageTitles();
  }, []);

  const onSortMenuEnd = (oldIndex, newIndex) => {
    const visibleItems = localMenu.filter((item) => item.isVisible);
    const invisibleItems = localMenu.filter((item) => !item.isVisible);
    const newMenu = [
      ...arrayMoveImmutable(visibleItems, oldIndex, newIndex),
      ...invisibleItems,
    ];
    setLocalMenu(newMenu);
  };

  const addComposablePage = (option) => {
    setLocalMenu((prevMenu) => [
      {
        label: option.title,
        name: option._id,
        isVisible: true,
        isComposablePage: true,
      },
      ...prevMenu,
    ]);
  };

  const removeComposablePage = (selectedItemName) => {
    setLocalMenu(localMenu?.filter((item) => item.name !== selectedItemName));
  };

  const getComposablePageOptions = () => {
    const existingComposableIdsInlocalMenu = localMenu?.map(
      (item) => item.name
    );

    const options = composablePageTitles?.filter(
      (item) =>
        item.isPublished &&
        !existingComposableIdsInlocalMenu?.includes(item._id)
    );
    return options;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await updateHostSettings({ values: { menu: localMenu } });
    setCurrentHost(await call('getCurrentHost'));
    setSubmitting(false);
  };

  return (
    <Box py="6">
      <Heading as="h4" size="sm">
        <Trans i18nKey="admin:settings.tabs.menuOrder" />
      </Heading>

      <Box mb="6">
        <Text fontSize="sm">
          <Trans i18nKey="admin:menu.tabs.order.info" />
        </Text>
      </Box>

      <Boxling
        style={{
          backgroundColor: 'var(--cocoso-colors-bluegray-50)',
        }}
      >
        <Box mb="8">
          <Box mb="2">
            <Text>
              <Trans i18nKey="admin:composable.form.addToMenu" />
            </Text>
          </Box>

          <ReactSelect
            options={getComposablePageOptions()}
            value={null}
            onChange={addComposablePage}
            getOptionValue={(option) => option._id}
            getOptionLabel={(option) => option.title}
          />
        </Box>

        {localMenu && (
          <SortableList onSortEnd={onSortMenuEnd}>
            {localMenu
              ?.filter((item) => item.isVisible)
              ?.map((value, index) => (
                <SortableItem key={value.name}>
                  <div>
                    <Flex
                      align="center"
                      justify="space-between"
                      mb="4"
                      p="2"
                      css={{
                        backgroundColor: 'white',
                        boxShadow: 'var(--cocoso-box-shadow)',
                        borderRadius: 'var(--cocoso-border-radius)',
                        cursor: 'move',
                        fontFamily: 'sans-serif',
                      }}
                    >
                      <Flex align="center">
                        <DragHandleIcon /> <Text ml="2">{value.label}</Text>
                      </Flex>
                      {value.isComposablePage ? (
                        <IconButton
                          colorScheme="bluegray"
                          icon={
                            <XIcon
                              size="18px"
                              onClick={() => removeComposablePage(value.name)}
                            />
                          }
                          size="xs"
                          variant="ghost"
                        />
                      ) : null}
                    </Flex>
                  </div>
                </SortableItem>
              ))}
          </SortableList>
        )}

        <Flex justify="flex-end" mt="8">
          <Button loading={submitting} onClick={handleSubmit}>
            <Trans i18nKey="common:actions.submit" />
          </Button>
        </Flex>
      </Boxling>
    </Box>
  );
}
