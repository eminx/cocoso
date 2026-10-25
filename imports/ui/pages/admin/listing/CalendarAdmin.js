import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import { currentHostAtom } from '/imports/state';
import { Box, Checkbox, Flex, Heading, Text } from '/imports/ui/core';
import FormField from '/imports/ui/forms/FormField';
import Boxling from '/imports/ui/pages/admin/Boxling';
import { defaultCalendar } from '/imports/startup/constants';

import FeatureAdminWrapper from './_FeatureAdminWrapper';

const listing = 'calendar';

function CalendarOptions() {
  const currentHost = useAtomValue(currentHostAtom);
  const [state, setState] = useState(
    currentHost?.settings?.calendar || {
      views: defaultCalendar,
    }
  );
  const [t] = useTranslation('admin');

  const handleDisplayOptionSelect = (event, option) => {
    const checked = event.target.checked;
    console.log('checked:', option, checked);

    setState((prevState) => ({
      ...prevState,
      views: prevState.views?.map((v) => ({
        ...v,
        isVisible: v.value === option.value ? checked : v.isVisible,
      })),
    }));
  };

  return (
    <Box>
      <Heading as="h3" size="sm" mt="6" mb="2">
        {t('calendar.display.title')}
      </Heading>
      <Box pb="4">
        <Text size="sm">{t('calendar.display.helper')}</Text>
      </Box>
      <Boxling>
        <Flex direction="column">
          {state?.views?.map((option) => (
            <Checkbox
              key={option.value}
              checked={option.isVisible}
              id={option.value}
              onChange={(event) => handleDisplayOptionSelect(event, option)}
            >
              {t(`calendar.display.${option.value}`)}
            </Checkbox>
          ))}
        </Flex>
      </Boxling>
    </Box>
  );
}

export default function CalendarAdmin() {
  // const [t] = useTranslation('admin');

  // const tabs = [
  //   {
  //     title: t('settings.tabs.options'),
  //     path: 'options',
  //     content: <CalendarOptions />,
  //   },
  // ];

  return <FeatureAdminWrapper listing={listing} />;
}
