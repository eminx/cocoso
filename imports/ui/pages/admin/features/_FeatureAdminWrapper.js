import React from 'react';
import { Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import TablyRouter from '../../../generic/TablyRouter';
import MainFeatureSettings from './MainFeatureSettings';

export default function FeatureAdminWrapper({ menuItemName, furtherTabs = [] }) {
  const [t] = useTranslation('admin');

  const tabs = [
    {
      title: t('menu.title'),
      path: 'menu',
      content: <MainFeatureSettings itemName={menuItemName} />,
    },
    ...furtherTabs,
  ];

  return (
    <>
      <Heading fontWeight="light" mb="6" size="md">
        {t(`menu.info.${menuItemName}`)}
      </Heading>
      <TablyRouter tabs={tabs} />
    </>
  );
}
