import React from 'react';
import { useTranslation } from 'react-i18next';

import { Heading } from '/imports/ui/core';
import TablyRouter from '/imports/ui/generic/TablyRouter';

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

  return (
    <>
      <Heading fontWeight="light" mb="6" size="md">
        {t(`menu.info.${menuItemName}`)}
      </Heading>
      <TablyRouter tabs={tabs} />
    </>
  );
}
