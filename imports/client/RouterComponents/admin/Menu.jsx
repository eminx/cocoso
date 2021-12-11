import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Heading,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { FieldControl, InputFormik } from 'chakra-formik-experiment';
import { Drag } from 'grommet-icons/icons/Drag';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { call } from '../../functions';
import Loader from '../../UIComponents/Loader';
import { message } from '../../UIComponents/message';
import { StateContext } from '../../LayoutContainer';

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

  const handleChangeActiveMenu = (value) => {
    console.log(value);
    return;
    setActiveMenu(value);
    const newMenu = localSettings.menu.map((item) => {
      return {
        ...item,
        label: value[item.name],
      };
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

  // const handleMenuSave = async (values) => {
  //   const newSettings = getNewSettings(values);

  //   setLoading(true);
  //   try {
  //     await call('updateHostSettings', newSettings);
  //     message.success('Settings are successfully saved');
  //   } catch (error) {
  //     message.error(error.reason);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (loading) {
  //   return <Loader />;
  // }

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

  const handleHandleChange = (e, v) => {
    console.log(e, v);
  };

  return (
    <Box>
      <Heading as="h3" size="md">
        Menu
      </Heading>
      <Tabs>
        <TabList>
          <Tab>Visibility</Tab>
          <Tab>Labels</Tab>
          <Tab>Order</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Text fontWeight="bold">Visibility</Text>
            <Text mb="4" fontSize="sm">
              Check/uncheck items to compose the main menu
            </Text>

            <Formik initialValues={activeMenu} onSubmit={handleMenuSave}>
              <Form>
                {localSettings &&
                  localSettings.menu &&
                  localSettings.menu.map((item, index) => (
                    <Box key={item.name} mb="2">
                      <Checkbox
                        isChecked={item.isVisible}
                        onChange={(event) =>
                          handleMenuItemCheck(index, event.target.checked)
                        }
                      >
                        {item.label}
                      </Checkbox>
                    </Box>
                  ))}

                <Box>
                  <Button type="submit">Confirm</Button>
                </Box>
              </Form>
            </Formik>
          </TabPanel>

          <TabPanel>
            <Text fontWeight="bold">Labels</Text>
            <Text mb="4" fontSize="sm">
              Type a name if you want to replace labels of the menu items. Note
              that only one word is allowed.
            </Text>
            {activeMenu && (
              <Formik
                value={activeMenu}
                onBlur={handleChangeActiveMenu}
                onSubmit={handleMenuSave}
              >
                {(handleChange) => (
                  <Form>
                    <VStack align="flex-start" spacing="2">
                      {localSettings.menu
                        .filter((ite) => ite.isVisible)
                        .map((item) => (
                          <FieldControl
                            key={item.name}
                            label={item.name}
                            name={item.name}
                          >
                            <InputFormik
                              placeholder={getMenuPlaceHolder(item.name)}
                              onChange={handleChange}
                            />
                          </FieldControl>
                        ))}

                      <Box>
                        <Button type="submit">Confirm</Button>
                      </Box>
                    </VStack>
                  </Form>
                )}
              </Formik>
            )}
          </TabPanel>

          <TabPanel>
            <Text fontWeight="bold">Order</Text>
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
            <Box>
              <Button onClick={handleMenuSave} type="submit">
                Confirm
              </Button>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
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
