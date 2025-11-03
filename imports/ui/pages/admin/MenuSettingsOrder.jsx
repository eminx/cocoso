import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import SortableList, { SortableItem } from 'react-easy-sort';
import ReactSelect from 'react-select';
import { arrayMoveImmutable } from 'array-move';
import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-horizontal';
import XIcon from 'lucide-react/dist/esm/icons/x';

import { call } from '/imports/ui/utils/shared';
import { Box, Button, Flex, Heading, Text } from '/imports/ui/core';
import { updateHostSettings } from '/imports/actions';

import Boxling from './Boxling';

export default function MenuSettingsOrder({ Host }) {
  const currentHost = Host;
  const [localSettings, setLocalSettings] = useState(Host?.settings);
  const [composablePageTitles, setComposablePageTitles] = useState([]);

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
    const { menu } = localSettings;
    const visibleItems = menu.filter((item) => item.isVisible);
    const invisibleItems = menu.filter((item) => !item.isVisible);
    const newSettings = {
      ...localSettings,
      menu: [
        ...arrayMoveImmutable(visibleItems, oldIndex, newIndex),
        ...invisibleItems,
      ],
    };
    setLocalSettings(newSettings);
  };

  const addComposablePage = (option) => {
    setLocalSettings((prevSettings) => ({
      ...prevSettings,
      menu: [
        {
          label: option.title,
          name: option._id,
          isVisible: true,
          isComposablePage: true,
        },
        ...prevSettings.menu,
      ],
    }));
  };

  const removeComposablePage = (selectedItemName) => {
    setLocalSettings((prevSettings) => ({
      ...prevSettings,
      menu: prevSettings.menu.filter((item) => item.name !== selectedItemName),
    }));
  };

  const getComposablePageOptions = () => {
    const existingComposableIdsInlocalMenu = localSettings.menu.map(
      (item) => item.name
    );

    const options = composablePageTitles?.filter(
      (item) =>
        item.isPublished && !existingComposableIdsInlocalMenu.includes(item._id)
    );
    return options;
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

        {localSettings && localSettings.menu && (
          <SortableList onSortEnd={onSortMenuEnd}>
            {localSettings.menu
              .filter((item) => item.isVisible)
              .map((value, index) => (
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
          <Button
            onClick={() => updateHostSettings({ values: localSettings })}
            type="submit"
          >
            <Trans i18nKey="common:actions.submit" />
          </Button>
        </Flex>
      </Boxling>
    </Box>
  );
}
