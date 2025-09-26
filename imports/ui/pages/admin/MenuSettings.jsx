import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-horizontal';
import XIcon from 'lucide-react/dist/esm/icons/x';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
import ReactSelect from 'react-select';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Loader,
  Text,
} from '/imports/ui/core';

import { call } from '../../utils/shared';
import { message } from '../../generic/message';
import { StateContext } from '../../LayoutContainer';
import TablyRouter from '../../generic/TablyRouter';
import Boxling from './Boxling';

export default function MenuSettings() {
  const [loading, setLoading] = useState(true);
  const [localSettings, setLocalSettings] = useState(null);
  const [composablePageTitles, setComposablePageTitles] = useState([]);
  const { currentUser, currentHost, role, getCurrentHost } =
    useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const handleSetLocalSettings = () => {
    const theLocalSettings = currentHost?.settings;
    setLocalSettings(theLocalSettings);
  };

  const getComposablePageTitles = async () => {
    try {
      const response = await call('getComposablePageTitles');
      setComposablePageTitles(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    if (!currentHost) {
      return;
    }
    getComposablePageTitles();
    handleSetLocalSettings();
    setLoading(false);
  }, []);

  if (loading || !localSettings || !localSettings.menu) {
    return <Loader />;
  }

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.accesss.deny')}</Alert>;
  }

  const handleSwitchBurgerMenuMobile = (checked) => {
    setLocalSettings((prevSettings) => ({
      ...prevSettings,
      isBurgerMenuOnMobile: checked,
      isBurgerMenuOnDesktop: !checked
        ? false
        : prevSettings.isBurgerMenuOnDesktop,
    }));
  };

  const handleSwitchBurgerMenuDesktop = (checked) => {
    setLocalSettings((prevSettings) => ({
      ...prevSettings,
      isBurgerMenuOnDesktop: checked,
    }));
  };

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

  const handleMenuSave = async () => {
    setLoading(true);
    try {
      await call('updateHostSettings', localSettings);
      await getCurrentHost();
      message.success(
        tc('message.success.save', { domain: tc('domains.settings') })
      );
    } catch (error) {
      message.error(error.reason);
    } finally {
      setLoading(false);
    }
  };

  const getComposablePageOptions = () => {
    const existingComposableIdsInlocalMenu = localSettings.menu.map(
      (item) => item.name
    );

    const options = composablePageTitles.filter(
      (item) =>
        item.isPublished && !existingComposableIdsInlocalMenu.includes(item._id)
    );
    return options;
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

  const settings = currentHost?.settings;
  const isOptionsSubmitButtonDisabled =
    settings.isBurgerMenuOnDesktop === localSettings.isBurgerMenuOnDesktop &&
    settings.isBurgerMenuOnMobile === localSettings.isBurgerMenuOnMobile;

  const tabs = [
    {
      title: t('settings.tabs.menuOrder'),
      path: 'order',
      content: (
        <Box py="6">
          <Heading as="h4" size="sm">
            {t('settings.tabs.menuOrder')}
          </Heading>

          <Box mb="6">
            <Text fontSize="sm">{t('menu.tabs.order.info')}</Text>
          </Box>

          <Boxling
            style={{
              backgroundColor: 'var(--cocoso-colors-bluegray-50)',
            }}
          >
            <Box mb="8">
              <Box mb="2">
                <Text>{t('composable.form.addToMenu')}</Text>
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
                                  onClick={() =>
                                    removeComposablePage(value.name)
                                  }
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
              <Button onClick={handleMenuSave} type="submit">
                {tc('actions.submit')}
              </Button>
            </Flex>
          </Boxling>
        </Box>
      ),
    },
    {
      title: t('menu.options.label'),
      path: 'options',
      content: (
        <Box py="6">
          <Heading as="h4" size="sm">
            {t('menu.burgermenu.title')}
          </Heading>

          <Box mb="6">
            <Text fontSize="sm">{t('menu.burgermenu.text')}</Text>
          </Box>

          <Boxling mb="4">
            <Flex py="4">
              <Checkbox
                checked={Boolean(localSettings.isBurgerMenuOnMobile)}
                id="is-burger-menu-mobile"
                name="isBurgerMenuOnMobile"
                onChange={(event) =>
                  handleSwitchBurgerMenuMobile(event.target.checked)
                }
              >
                {t('menu.burgermenu.mobile')}
              </Checkbox>
            </Flex>

            <Flex mb="4">
              <Checkbox
                checked={Boolean(localSettings.isBurgerMenuOnDesktop)}
                disabled={!localSettings.isBurgerMenuOnMobile}
                id="is-burger-menu-desktop"
                name="isBurgerMenuOnDesktop"
                onChange={(event) =>
                  handleSwitchBurgerMenuDesktop(event.target.checked)
                }
              >
                {t('menu.burgermenu.desktop')}
              </Checkbox>
            </Flex>
          </Boxling>

          <Flex justify="flex-end" pt="2">
            <Button
              disabled={isOptionsSubmitButtonDisabled}
              onClick={() => handleMenuSave()}
            >
              {tc('actions.submit')}
            </Button>
          </Flex>
        </Box>
      ),
    },
  ];

  return <TablyRouter tabs={tabs} />;
}
