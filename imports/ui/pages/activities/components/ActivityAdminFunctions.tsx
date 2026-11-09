import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useSearchParams } from 'react-router';

import AdminFunctions from '/imports/ui/entry/AdminFunctions';
import DeleteEntryHandler from '/imports/ui/entry/DeleteEntryHandler';
import type { MenuOption } from '/imports/ui/generic/Menu';
import DocumentUploader from '/imports/ui/forms/DocumentUploader';

export default function ActivityAdminFunctions() {
  const [tc] = useTranslation('common');
  const { activity, documents } = useLoaderData();
  const [, setSearchParams] = useSearchParams();

  const handleSetSearchParams = (key: string | undefined, value: string) => {
    if (!key) return;
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.set(key, value);
      return next;
    });
  };

  const handleSelect = (item: MenuOption) => {
    handleSetSearchParams(item.value, 'true');
  };

  const menuItems = [
    {
      value: 'documents',
      label: tc('documents.manage'),
    },
    {
      value: 'edit',
      label: tc('actions.update'),
    },
    {
      value: 'delete',
      label: tc('actions.remove'),
    },
  ];

  return (
    <>
      <AdminFunctions menuItems={menuItems} onSelect={handleSelect} />
      <DocumentUploader
        context="activities"
        documents={documents}
        itemId={activity._id}
      />
      <DeleteEntryHandler item={activity} context="activities" />
    </>
  );
}
