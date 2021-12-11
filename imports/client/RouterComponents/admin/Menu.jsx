import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Heading,
  Input,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Drag } from 'grommet-icons/icons/Drag';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { call } from '../../functions';
import Loader from '../../UIComponents/Loader';
import { message } from '../../UIComponents/message';
import { StateContext } from '../../LayoutContainer';
import FormField from '../../UIComponents/FormField';

const getMenuPlaceHolder = (item) => {
  switch (item) {
    case 'activities':
      return 'bookings';
    case 'calendar':
      return 'program';
    case 'processes':
      return 'workshops';
    case 'works':
      return 'offers';
    case 'info':
      return 'about';
    default:
      return '';
  }
};

export default function Menu() {
  const [loading, setLoading] = useState(true);
  const [localSettings, setLocalSettings] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const { currentUser, currentHost, role } = useContext(StateContext);

  if (!currentUser || role !== 'admin') {
    return <Alert>You are not allowed</Alert>;
  }

  useEffect(() => {
    if (!currentHost) {
      return;
    }
    setLocalSettings(currentHost.settings);
    currentHost.settings && handleSetActiveMenu();
    setLoading(false);
  }, []);

  const handleSetActiveMenu = (key, label) => {
    const newActiveMenu = {};
    currentHost.settings.menu.forEach((item) => {
      newActiveMenu[item.name] = item.label;
    });

    setActiveMenu(newActiveMenu);
  };

  const handleMenuItemCheck = (changedItemIndex, value) => {
    const newMenu = localSettings.menu.map((item, index) => {
      if (changedItemIndex === index) {
        return {
          ...item,
          isVisible: value,
        };
      }
      return item;
    });
    setLocalSettings({ ...localSettings, menu: newMenu });
  };

  const handleMenuItemLabelChange = (changedItemIndex, value) => {
    const newMenu = localSettings.menu.map((item, index) => {
      if (changedItemIndex === index) {
        return {
          ...item,
          label: value,
        };
      }
      return item;
    });
    setLocalSettings({ ...localSettings, menu: newMenu });
  };

  const onSortMenuEnd = ({ oldIndex, newIndex }) => {
    const { menu } = localSettings;
    const visibleItems = menu.filter((item) => item.isVisible);
    const invisibleItems = menu.filter((item) => !item.isVisible);
    const newSettings = {
      ...localSettings,
      menu: [...arrayMove(visibleItems, oldIndex, newIndex), ...invisibleItems],
    };
    setLocalSettings(newSettings);
  };

  getNewSettings = (values) => {
    const newMenu = localSettings.menu.map((item) => {
      return {
        ...item,
        label: value[item.name],
      };
    });

    return { ...localSettings, menu: newMenu };
  };

  const handleMenuSave = async () => {
    setLoading(true);
    try {
      await call('updateHostSettings', localSettings);
      message.success('Settings are successfully saved');
    } catch (error) {
      message.error(error.reason);
    } finally {
      setLoading(false);
    }
  };

  if (!localSettings || !localSettings.menu || !activeMenu) {
    return null;
  }

  return (
    <Box>
      <Heading as="h3" size="md">
        Menu
      </Heading>
      <Tabs>
        <TabList>
          <Tab>Visibility & Labels</Tab>
          <Tab>Order</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {/* <Text fontWeight="bold">Composition</Text> */}
            <Text mb="4" fontSize="sm">
              Check/uncheck items for visibility, and label them as you prefer
              in order to compose the menu
            </Text>
            <MenuTable
              menu={localSettings.menu}
              handleMenuItemCheck={handleMenuItemCheck}
              handleMenuItemLabelChange={handleMenuItemLabelChange}
            />

            <Flex justify="flex-end" my="4">
              <Button onClick={handleMenuSave}>Confirm</Button>
            </Flex>
          </TabPanel>

          <TabPanel>
            <Text mb="4" size="sm">
              Reorder items by dragging up and down, if you want to change the
              menu display order
            </Text>
            <Box>
              {localSettings && localSettings.menu && (
                <SortableContainer
                  onSortEnd={onSortMenuEnd}
                  helperClass="sortableHelper"
                >
                  {localSettings.menu
                    .filter((item) => item.isVisible)
                    .map((value, index) => (
                      <SortableItem
                        key={`item-${value.name}`}
                        index={index}
                        value={value.label}
                      />
                    ))}
                </SortableContainer>
              )}
            </Box>

            <Flex justify="flex-end" my="4">
              <Button onClick={handleMenuSave} type="submit">
                Confirm
              </Button>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

function MenuTable({ menu, handleMenuItemCheck, handleMenuItemLabelChange }) {
  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Visibility</th>
          <th>Labels</th>
        </tr>
      </thead>
      <tbody>
        {menu.map((item, index) => (
          <tr key={item.name}>
            <td>
              <Center>
                <Checkbox
                  isChecked={item.isVisible}
                  onChange={(event) =>
                    handleMenuItemCheck(index, event.target.checked)
                  }
                />
              </Center>
            </td>
            <td>
              <FormField>
                <Input
                  isDisabled={!item.isVisible}
                  value={item.label}
                  onChange={(e) =>
                    handleMenuItemLabelChange(index, e.target.value)
                  }
                />
              </FormField>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const SortableItem = sortableElement(({ value }) => (
  <Box className="sortable-thumb" mb="2">
    <Drag /> {value}
  </Box>
));

const SortableContainer = sortableContainer(({ children }) => (
  <Box>{children}</Box>
));
