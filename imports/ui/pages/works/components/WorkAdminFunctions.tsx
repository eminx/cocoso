import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useAtomValue } from 'jotai';

import AdminFunctions from '/imports/ui/entry/AdminFunctions';
import DeleteEntryHandler from '/imports/ui/entry/DeleteEntryHandler';
import DocumentUploader from '/imports/ui/forms/DocumentUploader';

import { workAtom } from '../WorkItemHandler';

export default function WorkAdminFunctions() {
  const [t] = useTranslation('groups');
  const [tc] = useTranslation('common');
  const work = useAtomValue(workAtom);
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
      label: t('admin.add_document'),
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

      {addDocument ? (
        <DocumentUploader
          documents={work.documents}
          itemId={work._id}
          context="work"
          onClose={handleClose}
        />
      ) : null}

      <DeleteEntryHandler item={work} context="works" />
    </>
  );
}
