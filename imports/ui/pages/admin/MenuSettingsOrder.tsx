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
import { call } from '/imports/api/_utils/shared';
import { MenuItem } from '/imports/ui/types';

import Boxling from './Boxling';

export default function MenuSettingsOrder() {
  const [currentHost, setCurrentHost] = useAtom(currentHostAtom);
  const [localMenu, setLocalMenu] = useState(currentHost?.settings?.menu);
  const [composablePageTitles, setComposablePageTitles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [justAddedName, setJustAddedName] = useState<string | null>(null);

  useEffect(() => {
    if (!justAddedName) {
      return;
    }
    const timer = setTimeout(() => setJustAddedName(null), 1500);
    return () => clearTimeout(timer);
  }, [justAddedName]);

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
    setJustAddedName(option._id);
  };

  const addListingPage = (option: MenuItem) => {
    setLocalMenu((prevMenu) =>
      prevMenu?.map((item) =>
        item.name === option.name ? { ...item, isVisible: true } : item
      )
    );
    setJustAddedName(option.name);
  };

  const removeMenuItem = (selectedMenuItem: MenuItem) => {
    if (selectedMenuItem.isComposablePage) {
      removeComposablePage(selectedMenuItem.name);
    } else {
      removeListingPage(selectedMenuItem.name);
    }
  };

  const removeComposablePage = (selectedItemName: string) => {
    setLocalMenu(localMenu?.filter((item) => item.name !== selectedItemName));
  };

  const removeListingPage = (selectedItemName: string) => {
    setLocalMenu((prevMenu) =>
      prevMenu?.map((item) =>
        item.name === selectedItemName ? { ...item, isVisible: false } : item
      )
    );
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
    window.location.reload();
  };

  const listingPageOptions = localMenu?.filter(
    (item) => !item.isComposablePage && !item.isVisible
  );

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
        <Flex gap="4" mb="8">
          <Box flex="1">
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

          <Box flex="1">
            <Box mb="2">
              <Text>
                <Trans i18nKey="admin:composable.form.addToMenuListing" />
              </Text>
            </Box>
            <ReactSelect
              options={listingPageOptions}
              value={null}
              onChange={addListingPage}
              getOptionValue={(option: MenuItem) => option.name}
            />
          </Box>
        </Flex>

        {localMenu && (
          <SortableList onSortEnd={onSortMenuEnd}>
            {localMenu
              ?.filter((item) => item.isVisible)
              ?.map((value) => (
                <SortableItem key={value.name}>
                  <div>
                    <Flex
                      align="center"
                      justify="space-between"
                      mb="4"
                      p="2"
                      css={{
                        backgroundColor:
                          value.name === justAddedName
                            ? 'var(--cocoso-colors-green-100)'
                            : 'white',
                        boxShadow: 'var(--cocoso-box-shadow)',
                        borderRadius: 'var(--cocoso-border-radius)',
                        cursor: 'move',
                        fontFamily: 'sans-serif',
                        transition: 'background-color 1.2s ease',
                      }}
                    >
                      <Flex align="center">
                        <DragHandleIcon /> <Text ml="2">{value.label}</Text>
                      </Flex>
                      <IconButton
                        aria-label="Remove"
                        colorScheme="bluegray"
                        icon={
                          <XIcon
                            size="18px"
                            onClick={() => removeMenuItem(value)}
                          />
                        }
                        size="xs"
                        variant="ghost"
                      />
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
