import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@chakra-ui/react';
import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-horizontal';
import XIcon from 'lucide-react/dist/esm/icons/x';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';
import ReactSelect from 'react-select';

import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
} from '/imports/ui/core';

import { call } from '../../utils/shared';
import Loader from '../../generic/Loader';
import { message } from '../../generic/message';
import Alert from '../../generic/Alert';
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
        item.isPublished &&
        !existingComposableIdsInlocalMenu.includes(item._id)
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

  const removeComposablePage = (itemIndex) => {
    setLocalSettings((prevSettings) => ({
      ...prevSettings,
      menu: prevSettings.menu.filter((_, index) => index !== itemIndex),
    }));
  };

  const settings = currentHost?.settings;
  const isOptionsSubmitButtonDisabled =
    settings.isBurgerMenuOnDesktop ===
      localSettings.isBurgerMenuOnDesktop &&
    settings.isBurgerMenuOnMobile ===
      localSettings.isBurgerMenuOnMobile;

  const tabs = [
    {
      title: t('settings.tabs.menuOrder'),
      path: 'order',
      content: (
        <Box py="8">
          <Heading as="h4" fontSize="18px" mb="2">
            {t('settings.tabs.menuOrder')}
          </Heading>

          <Text mb="4">{t('menu.tabs.order.info')}</Text>

          <Boxling
            style={{
              backgroundColor: 'var(--cocoso-colors-bluegray-50)',
            }}
          >
            <Box mb="8" p="2">
              <Text fontSize="lg" mb="2">
                {t('composable.form.addToMenu')}
              </Text>

              <ReactSelect
                options={getComposablePageOptions()}
                placeholder="Select a page"
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
                      <Flex
                        align="center"
                        justifyContent="space-between"
                        mb="4"
                        p="2"
                        style={{
                          backgroundColor: 'white',
                          boxShadow: 'var(--cocoso-box-shadow)',
                          borderRadius: 'var(--cocoso-border-radius)',
                          cursor: 'move',
                          fontFamily: 'sans-serif',
                        }}
                      >
                        <Flex align="center">
                          <DragHandleIcon />{' '}
                          <Text ml="2">{value.label}</Text>
                        </Flex>
                        {value.isComposablePage ? (
                          <IconButton
                            colorScheme="gray"
                            icon={
                              <XIcon
                                size="18px"
                                onClick={() =>
                                  removeComposablePage(index)
                                }
                              />
                            }
                            size="xs"
                            variant="ghost"
                          />
                        ) : null}
                      </Flex>
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
        <Box my="8">
          <Boxling mb="4">
            <Heading as="h4" fontSize="18px" mb="2">
              {t('menu.burgermenu.title')}
            </Heading>

            <Text mb="4">{t('menu.burgermenu.text')}</Text>

            <Flex mb="4">
              <Switch
                isChecked={Boolean(localSettings.isBurgerMenuOnMobile)}
                mr="2"
                mt="1"
                name="isBurgerMenuOnMobile"
                onChange={(event) =>
                  handleSwitchBurgerMenuMobile(event.target.checked)
                }
              />

              <Box>
                <Text fontWeight="bold">
                  {t('menu.burgermenu.mobile')}
                </Text>
              </Box>
            </Flex>

            <Flex mb="4">
              <Switch
                isChecked={Boolean(localSettings.isBurgerMenuOnDesktop)}
                isDisabled={!localSettings.isBurgerMenuOnMobile}
                mr="2"
                mt="1"
                name="isBurgerMenuOnDesktop"
                onChange={(event) =>
                  handleSwitchBurgerMenuDesktop(event.target.checked)
                }
              />

              <Box>
                <Text fontWeight="bold">
                  {t('menu.burgermenu.desktop')}
                </Text>
              </Box>
            </Flex>
          </Boxling>

          <Flex justify="flex-end" pt="2">
            <Button
              isDisabled={isOptionsSubmitButtonDisabled}
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
