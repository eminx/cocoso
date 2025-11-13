import React from 'react';
import { useTranslation } from 'react-i18next';

import FeatureAdminWrapper from './_FeatureAdminWrapper';
import PagesAdminOrder from './PagesAdminOrder';

const listing = 'info';

export default function PagesAdmin() {
  const [t] = useTranslation('admin');

  const tabs = [
    {
      title: t('pages.order.title'),
      path: 'order',
      content: <PagesAdminOrder />,
    },
  ];

  return <FeatureAdminWrapper furtherTabs={tabs} listing={listing} />;
}
