import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Switch,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../../../LayoutContainer';
import { call } from '../../../utils/shared';
import { message } from '../../../generic/message';
import Boxling from '../Boxling';

const keyProps = {
  flex: '0 0 100px',
  py: '1',
};

function Tablish({ rowItem }) {
  return (
    <Flex w="100%">
      <Text {...keyProps}>{rowItem.key}</Text>
      <Box flexGrow="1">{rowItem.value}</Box>
    </Flex>
  );
}

export default function MainFeatureSettings({ itemName }) {
  const { currentHost, getCurrentHost } = useContext(StateContext);
  const [localItem, setLocalItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const selectedMenuItem = currentHost?.settings?.menu?.find(
    (menuItem) => menuItem.name === itemName
  );

  useEffect(() => {
    setLocalItem(selectedMenuItem);
  }, [currentHost?.settings]);

  const handleMenuItemCheck = (value) => {
    setLocalItem((prevItem) => ({
      ...prevItem,
      isVisible: value,
    }));
  };

  const handleMenuItemLabelChange = (value) => {
    setLocalItem((prevItem) => ({
      ...prevItem,
      label: value,
    }));
  };

  const handleMenuItemDescriptionChange = (value) => {
    setLocalItem((prevItem) => ({
      ...prevItem,
      description: value,
    }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    const localSettings = {
      ...currentHost.settings,
      menu: currentHost.settings?.menu?.map((menuItem) => {
        if (menuItem.name === itemName) {
          return localItem;
        }
        return menuItem;
      }),
    };

    try {
      await call('updateHostSettings', localSettings);
      await getCurrentHost();
      message.success(tc('message.success.save', { domain: tc('domains.settings') }));
    } catch (error) {
      message.error(error.reason);
    } finally {
      setSubmitting(false);
    }
  };

  if (!localItem) {
    return null;
  }

  const rowItems = [
    {
      key: 'Active',
      value: (
        <Switch
          isChecked={localItem.isVisible}
          onChange={(event) => handleMenuItemCheck(event.target.checked)}
        />
      ),
    },
    {
      key: 'Label',
      value: (
        <Input
          isDisabled={!localItem.isVisible}
          maxW="240px"
          size="sm"
          value={localItem.label}
          onChange={(event) => handleMenuItemLabelChange(event.target.value)}
        />
      ),
    },
    {
      key: 'Description',
      value: (
        <Textarea
          _focus={{
            borderColor: 'gray.600',
          }}
          border="2px solid"
          borderColor="gray.300"
          isDisabled={!localItem.isVisible}
          value={localItem.description}
          onChange={(event) => handleMenuItemDescriptionChange(event.target.value)}
        />
      ),
    },
  ];

  return (
    <>
      <Heading as="h3" size="sm" mt="6" mb="4">
        {t('menu.tabs.menuitems.label')}
      </Heading>

      <Boxling>
        <VStack align="flex-start" spacing="6">
          {rowItems.map((rowItem) => (
            <Tablish key={rowItem.key} rowItem={rowItem} />
          ))}
        </VStack>

        <Flex justify="flex-end" mt="6">
          <Button
            isDisabled={localItem === selectedMenuItem}
            isLoading={submitting}
            type="submit"
            onClick={handleSave}
          >
            {tc('actions.submit')}
          </Button>
        </Flex>
      </Boxling>
    </>
  );
}
