import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Flex, Heading, Switch, Text } from '@chakra-ui/react';

import DragHandleIcon from 'lucide-react/dist/esm/icons/grip-horizontal';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable } from 'array-move';

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
  const { currentUser, currentHost, role, getCurrentHost } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const handleSetLocalSettings = () => {
    const theLocalSettings = currentHost?.settings;
    setLocalSettings(theLocalSettings);
  };

  useEffect(() => {
    if (!currentHost) {
      return;
    }
    handleSetLocalSettings();
    setLoading(false);
  }, []);

  if (loading || !localSettings || !localSettings.menu) {
    return <Loader />;
  }

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.accesss.deny')}</Alert>;
  }

  const handleSwitchHeaderMenu = (checked) => {
    setLocalSettings({
      ...localSettings,
      isHeaderMenu: checked,
    });
  };

  const onSortMenuEnd = (oldIndex, newIndex) => {
    const { menu } = localSettings;
    const visibleItems = menu.filter((item) => item.isVisible);
    const invisibleItems = menu.filter((item) => !item.isVisible);
    const newSettings = {
      ...localSettings,
      menu: [...arrayMoveImmutable(visibleItems, oldIndex, newIndex), ...invisibleItems],
    };
    setLocalSettings(newSettings);
  };

  const handleMenuSave = async () => {
    setLoading(true);
    try {
      await call('updateHostSettings', localSettings);
      getCurrentHost();
      message.success(tc('message.success.save', { domain: tc('domains.settings') }));
    } catch (error) {
      message.error(error.reason);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      title: t('settings.tabs.menuOrder'),
      path: 'order',
      content: (
        <Box my="8">
          <Heading as="h4" fontSize="18px" mb="2">
            {t('settings.tabs.menuOrder')}
          </Heading>

          <Text mb="4">{t('menu.tabs.order.info')}</Text>

          <Boxling>
            {localSettings && localSettings.menu && (
              <SortableList onSortEnd={onSortMenuEnd}>
                {localSettings.menu
                  .filter((item) => item.isVisible)
                  .map((value) => (
                    <SortableItem key={value.name}>
                      <Flex
                        align="center"
                        bg="white"
                        boxShadow="md"
                        borderRadius="lg"
                        cursor="move"
                        mb="4"
                        p="2"
                        style={{ fontFamily: 'Sarabun, sans-serif' }}
                      >
                        <DragHandleIcon /> <Text ml="2">{value.label}</Text>
                      </Flex>
                    </SortableItem>
                  ))}
              </SortableList>
            )}
            <Flex justify="flex-end" my="6">
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
              {t('menu.headerMenu.title')}
            </Heading>

            <Text mb="4">{t('menu.headerMenu.text')}</Text>

            <Flex>
              <Switch
                mr="2"
                mt="1"
                name="isHeaderMenu"
                isChecked={localSettings.isHeaderMenu}
                onChange={(event) => handleSwitchHeaderMenu(event.target.checked)}
              />

              <Box>
                <Text fontWeight="bold">{t('menu.headerMenu.label')}</Text>
              </Box>
            </Flex>
          </Boxling>

          <Flex justify="flex-end" pt="2">
            <Button
              isDisabled={currentHost?.settings?.isHeaderMenu === localSettings?.isHeaderMenu}
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
