import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useSearchParams } from 'react-router';

import AdminFunctions from '/imports/ui/entry/AdminFunctions';
import DeleteEntryHandler from '/imports/ui/entry/DeleteEntryHandler';
import DocumentUploader from '/imports/ui/forms/DocumentUploader';
import { MenuOption } from '/imports/ui/generic/Menu';

export default function WorkAdminFunctions() {
  const [tc] = useTranslation('common');
  const { work, documents } = useLoaderData();
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
        context="works"
        documents={documents}
        itemId={work._id}
      />

      <DeleteEntryHandler item={work} context="works" />
    </>
  );
}
