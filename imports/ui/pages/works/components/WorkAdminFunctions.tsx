import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useSearchParams } from 'react-router';

import AdminFunctions from '/imports/ui/entry/AdminFunctions';
import DeleteEntryHandler from '/imports/ui/entry/DeleteEntryHandler';
import DocumentUploader from '/imports/ui/forms/DocumentUploader';

export default function WorkAdminFunctions() {
  const [tc] = useTranslation('common');
  const { work, documents } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSelect = (item: { kind: string }) => {
    if (item.kind === 'edit') {
      setSearchParams({ edit: 'true' });
    } else if (item.kind === 'delete') {
      setSearchParams({ delete: 'true' });
    } else if (item.kind === 'add_document') {
      setSearchParams({ addDocument: 'true' });
    }
  };

  const handleClose = () => {
    setSearchParams((params) => ({
      ...params,
      addDocument: 'false',
    }));
  };

  const menuItems = [
    {
      kind: 'add_document',
      label: tc('documents.add'),
    },
    {
      kind: 'edit',
      label: tc('actions.update'),
    },
    {
      kind: 'delete',
      label: tc('actions.remove'),
    },
  ];

  const addDocument = searchParams.get('addDocument') === 'true';

  return (
    <>
      <AdminFunctions menuItems={menuItems} onSelect={handleSelect} />

      <DocumentUploader
        active={addDocument}
        documents={documents}
        itemId={work._id}
        context="works"
        onClose={handleClose}
      />

      <DeleteEntryHandler item={work} context="works" />
    </>
  );
}
