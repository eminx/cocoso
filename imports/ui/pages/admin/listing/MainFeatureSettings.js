import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';

import { currentHostAtom } from '/imports/state';
import { updateHostSettings } from '/imports/actions';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
} from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';

import Boxling from '../Boxling';

const keyProps = {
  flex: '0 0 100px',
  py: '1',
};

function Tablish({ rowItem }) {
  return (
    <Flex w="100%">
      <Text {...keyProps}>{rowItem.key}</Text>
      <Box css={{ flexGrow: '1' }}>{rowItem.value}</Box>
    </Flex>
  );
}

export default function MainFeatureSettings({ listing }) {
  const [currentHost, setCurrentHost] = useAtom(currentHostAtom);
  const [localItem, setLocalItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const selectedMenuItem = currentHost?.settings?.menu?.find(
    (menuItem) => menuItem.name === listing
  );

  useEffect(() => {
    setLocalItem(selectedMenuItem);
  }, [currentHost?.settings]);

  const visibilityOptions = useMemo(
    () => [
      {
        label: t('menu.visibility.options.everyone'),
        value: 'everyone',
      },
      {
        label: t('menu.visibility.options.onlyUsers'),
        value: 'onlyUsers',
      },
      {
        label: t('menu.visibility.options.onlyVerified'),
        value: 'onlyVerified',
      },
      {
        label: t('menu.visibility.options.onlyAdmin'),
        value: 'onlyAdmin',
      },
    ],
    [t]
  );

  const handleChange = (key, value) => {
    setLocalItem((prevItem) => {
      const newItem = {
        ...prevItem,
      };
      newItem[key] = value;
      return newItem;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const localSettings = {
      ...currentHost.settings,
      menu: currentHost.settings?.menu?.map((menuItem) => {
        if (menuItem.name === listing) {
          return localItem;
        }
        return menuItem;
      }),
    };

    try {
      await call('updateHostSettings', localSettings);
      setCurrentHost(await call('getCurrentHost'));
      message.success(
        tc('message.success.save', { domain: tc('domains.settings') })
      );
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
        <Box pt="2">
          <Checkbox
            checked={localItem.isVisible}
            id="is-item-active"
            size="lg"
            onChange={(event) =>
              handleChange('isVisible', event.target.checked)
            }
          />
        </Box>
      ),
    },
    {
      key: 'Visibility',
      value: (
        <Box>
          <Select
            disabled={!localItem.isVisible}
            value={localItem.visibility}
            onChange={(event) => handleChange('visibility', event.target.value)}
          >
            {visibilityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </Box>
      ),
    },
    {
      key: 'Label',
      value: (
        <Input
          disabled={!localItem.isVisible}
          value={localItem.label}
          onChange={(event) => handleChange('label', event.target.value)}
        />
      ),
    },
    {
      key: 'Description',
      value: (
        <Textarea
          disabled={!localItem.isVisible}
          value={localItem.description}
          onChange={(event) => handleChange('description', event.target.value)}
        />
      ),
    },
  ];

  return (
    <>
      <Heading as="h3" size="sm" mt="6" mb="2">
        {t('menu.tabs.menuitems.label')}
      </Heading>
      <Box pb="4">
        <Text size="sm">{t('menu.tabs.menuitems.info')}</Text>
      </Box>

      <Boxling>
        <Flex direction="column">
          {rowItems.map((rowItem) => (
            <Tablish key={rowItem.key} rowItem={rowItem} />
          ))}
        </Flex>

        <Flex justify="flex-end" mt="6">
          <Button
            isDisabled={localItem === selectedMenuItem}
            isLoading={submitting}
            type="submit"
            onClick={handleSubmit}
          >
            {tc('actions.submit')}
          </Button>
        </Flex>
      </Boxling>
    </>
  );
}
