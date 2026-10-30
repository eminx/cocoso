import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import { currentHostAtom } from '/imports/state';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  RadioGroup,
  Text,
} from '/imports/ui/core';
import Boxling from '/imports/ui/pages/admin/Boxling';
import { updateHostSettings } from '/imports/actions';

import FeatureAdminWrapper from './_FeatureAdminWrapper';

const listing = 'people';

const showOptions = [
  { label: <Trans i18nKey="admin:users.show.all" />, value: 'all' },
  {
    label: <Trans i18nKey="admin:users.show.verifiedAdmin" />,
    value: 'verifiedAdmin',
  },
  { label: <Trans i18nKey="admin:users.show.admin" />, value: 'admin' },
];

function PeopleOptionsAdmin() {
  const currentHost = useAtomValue(currentHostAtom);
  const [tc] = useTranslation('common');
  const [state, setState] = useState({
    show: 'all',
  });

  const handleShowChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      listingPeopleShow: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateHostSettings({ values: state });
      message.success(tc('message.success.update'));
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  if (!currentHost || !currentHost.settings) {
    return null;
  }

  return (
    <Box>
      <Heading as="h3" size="sm" mt="6" mb="2">
        <Trans i18nKey="admin:users.show.title" />
      </Heading>
      <Box pb="4">
        <Text size="sm">
          <Trans i18nKey="admin:users.show.description" />
        </Text>
      </Box>
      <Boxling>
        <RadioGroup
          options={showOptions}
          value={state.listingPeopleShow}
          onChange={handleShowChange}
        />

        <Flex justify="flex-end" mt="4" w="100%">
          <Button
            disabled={
              state.listingPeopleShow === currentHost.settings.listingPeopleShow
            }
          >
            <Trans i18nKey="common:actions.submit" />
          </Button>
        </Flex>
      </Boxling>
    </Box>
  );
}

export default function PeopleAdmin() {
  const [t] = useTranslation('admin');

  const tabs = [
    {
      title: t('settings.tabs.options'),
      path: 'options',
      content: <PeopleOptionsAdmin />,
    },
  ];

  return <FeatureAdminWrapper furtherTabs={tabs} listing={listing} />;
}
