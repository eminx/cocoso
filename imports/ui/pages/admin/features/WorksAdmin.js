import React from 'react';
import { useTranslation } from 'react-i18next';

import Categories from '../Categories';
import FeatureAdminWrapper from './_FeatureAdminWrapper';

const menuItemName = 'works';

export default function WorksAdmin() {
  const [t] = useTranslation('admin');

  const tabs = [
    {
      title: t('categories.title'),
      path: 'categories',
      content: <Categories />,
    },
  ];

  return <FeatureAdminWrapper menuItemName={menuItemName} furtherTabs={tabs} />;
}
