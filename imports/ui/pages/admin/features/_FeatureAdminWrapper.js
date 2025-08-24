import React from 'react';

import { useTranslation } from 'react-i18next';

import TablyRouter from '../../../generic/TablyRouter';
import MainFeatureSettings from './MainFeatureSettings';

export default function FeatureAdminWrapper({
  menuItemName,
  furtherTabs = [],
}) {
  const [t] = useTranslation('admin');

  const tabs = [
    {
      title: t('menu.title'),
      path: 'menu',
      content: <MainFeatureSettings itemName={menuItemName} />,
    },
    ...furtherTabs,
  ];

  return <TablyRouter tabs={tabs} />;
}
