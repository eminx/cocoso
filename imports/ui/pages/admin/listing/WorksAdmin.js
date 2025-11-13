import React from 'react';
import { useTranslation } from 'react-i18next';

import CategoriesAdmin from '../CategoriesAdmin';
import FeatureAdminWrapper from './_FeatureAdminWrapper';

const listing = 'works';

export default function WorksAdmin() {
  const [t] = useTranslation('admin');

  const tabs = [
    {
      title: t('categories.title'),
      path: 'categories',
      content: <CategoriesAdmin />,
    },
  ];

  return <FeatureAdminWrapper listing={listing} furtherTabs={tabs} />;
}
