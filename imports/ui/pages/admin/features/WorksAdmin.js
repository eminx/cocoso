import React from 'react';
import { useTranslation } from 'react-i18next';

import Categories from '../Categories';
import TablyRouter from '../../../generic/TablyRouter';

export default function WorksAdmin() {
  const [t] = useTranslation('admin');

  const tabs = [
    {
      title: t('categories.title'),
      path: 'categories',
      content: <Categories />,
    },
  ];

  return <TablyRouter tabs={tabs} />;
}
