import React from 'react';
import { Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import MainFeatureSettings from './MainFeatureSettings';

const menuItemName = 'activities';

export default function ActivitiesAdmin() {
  const [t] = useTranslation('admin');
  return (
    <>
      <Heading size="sm" mb="6">
        {t(`menu.info.${menuItemName}`)}
      </Heading>
      <MainFeatureSettings itemName={menuItemName} />
    </>
  );
}
