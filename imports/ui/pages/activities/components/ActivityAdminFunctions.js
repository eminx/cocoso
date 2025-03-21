import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import AdminFunctions from '../../../entry/AdminFunctions';
import { ActivityContext } from '../Activity';
import DeleteEntryHandler from '../../../entry/DeleteEntryHandler';

export default function ActivityAdminFunctions() {
  const [tc] = useTranslation('common');
  const activityContext = useContext(ActivityContext);
  const [, setSearchParams] = useSearchParams();

  const activity = activityContext?.activity;

  const handleSelect = (item) => {
    if (item.kind === 'edit') {
      setSearchParams({ edit: 'true' });
    } else if (item.kind === 'delete') {
      setSearchParams({ delete: 'true' });
    }
  };

  const menuItems = [
    {
      kind: 'edit',
      label: tc('actions.update'),
    },
    {
      kind: 'delete',
      label: tc('actions.remove'),
    },
  ];

  return (
    <>
      <AdminFunctions menuItems={menuItems} onSelect={handleSelect} />
      <DeleteEntryHandler item={activity} context="activities" />
    </>
  );
}
