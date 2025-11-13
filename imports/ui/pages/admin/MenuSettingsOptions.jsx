import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { useAtomValue } from 'jotai';

import { Box, Button, Checkbox, Heading, Flex, Text } from '/imports/ui/core';
import { updateHostSettings } from '/imports/actions';
import { currentHostAtom } from '/imports/state';

import Boxling from './Boxling';

export default function MenuSettingsOptions({ Host }) {
  const currentHost = useAtomValue(currentHostAtom);
  const [localSettings, setLocalSettings] = useState({
    isBurgerMenuOnMobile: Boolean(currentHost?.settings?.isBurgerMenuOnMobile),
    isBurgerMenuOnDesktop: Boolean(
      currentHost?.settings?.isBurgerMenuOnDesktop
    ),
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSwitchBurgerMenuMobile = (checked) => {
    setLocalSettings((prevSettings) => ({
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

  const handleSubmit = async () => {
    setSubmitting(true);
    await updateHostSettings({ values: localSettings });
    setSubmitting(false);
  };

  const settings = currentHost?.settings;
  const isOptionsSubmitButtonDisabled =
    settings.isBurgerMenuOnDesktop === localSettings.isBurgerMenuOnDesktop &&
    settings.isBurgerMenuOnMobile === localSettings.isBurgerMenuOnMobile;

  return (
    <Box py="6">
      <Heading as="h4" size="sm">
        <Trans i18nKey="admin:menu.burgermenu.title" />
      </Heading>

      <Box mb="6">
        <Text fontSize="sm">
          <Trans i18nKey="admin:menu.burgermenu.text" />
        </Text>
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
            <Trans i18nKey="admin:menu.burgermenu.mobile" />
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
            <Trans i18nKey="admin:menu.burgermenu.desktop" />
          </Checkbox>
        </Flex>
      </Boxling>

      <Flex justify="flex-end" pt="2">
        <Button
          disabled={isOptionsSubmitButtonDisabled}
          loading={submitting}
          onClick={handleSubmit}
        >
          <Trans i18nKey="common:actions.submit" />
        </Button>
      </Flex>
    </Box>
  );
}
