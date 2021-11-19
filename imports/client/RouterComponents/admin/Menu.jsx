import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  CheckBox,
  Form,
  FormField,
  Tabs,
  Tab,
  Text,
  TextInput,
} from 'grommet';
import { Heading } from '@chakra-ui/react';
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
      newActiveMenu[item.name] = item.label.toUpperCase();
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

  if (loading) {
    return <Loader />;
  }

  return (
    <Box>
      <Heading as="h3" size="md">
        Menu
      </Heading>
      <Tabs>
        <Tab title="Visibility">
          <Box margin={{ bottom: 'large' }}>
            <Text weight="bold">Visibility</Text>
            <Text margin={{ bottom: 'medium' }} size="small">
              Check/uncheck items to compose the main menu
            </Text>

            <Form onSubmit={() => handleMenuSave()}>
              {localSettings &&
                localSettings.menu &&
                localSettings.menu.map((item, index) => (
                  <Box key={item.name} margin={{ bottom: 'small' }}>
                    <CheckBox
                      checked={item.isVisible}
                      label={item.label}
                      onChange={(event) =>
                        handleMenuItemCheck(index, event.target.checked)
                      }
                    />
                  </Box>
                ))}

              <Box direction="row" justify="start" pad={{ vertical: 'small' }}>
                <Button type="submit" label="Confirm" />
              </Box>
            </Form>
          </Box>
        </Tab>

        <Tab title="Labels">
          <Box margin={{ bottom: 'large' }}>
            <Text weight="bold">Labels</Text>
            <Text margin={{ bottom: 'medium' }} size="small">
              Type a name if you want to replace labels of the menu items. Note
              that only one word is allowed.
            </Text>
            {activeMenu && (
              <Form
                value={activeMenu}
                onChange={(value) => handleChangeActiveMenu(value)}
                onSubmit={() => handleMenuSave()}
              >
                {localSettings.menu
                  .filter((ite) => ite.isVisible)
                  .map((item) => (
                    <LabelChangableItem key={item.name} name={item.name} />
                  ))}

                <Box
                  direction="row"
                  justify="start"
                  pad={{ vertical: 'small' }}
                >
                  <Button type="submit" label="Confirm" />
                </Box>
              </Form>
            )}
          </Box>
        </Tab>

        <Tab title="Order">
          <Box margin={{ bottom: 'large' }}>
            <Text weight="bold">Order</Text>
            <Text margin={{ bottom: 'medium' }} size="small">
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
            <Box direction="row" justify="end" pad={{ vertical: 'small' }}>
              <Button onClick={handleMenuSave} type="submit" label="Confirm" />
            </Box>
          </Box>
        </Tab>
      </Tabs>
    </Box>
  );
}

const SortableItem = sortableElement(({ value }) => (
  <Box
    key={value}
    className="sortable-thumb"
    pad="small"
    margin={{ bottom: 'small' }}
    background="light-1"
    direction="row"
  >
    <Drag /> {value}
  </Box>
));

const SortableContainer = sortableContainer(({ children }) => (
  <Box>{children}</Box>
));

const LabelChangableItem = ({ name }) => (
  <Box width="medium">
    <FormField name={name} label={name.toUpperCase()} size="small">
      <TextInput
        plain={false}
        name={name}
        size="small"
        placeholder={getMenuPlaceHolder(name)}
      />
    </FormField>
  </Box>
);
