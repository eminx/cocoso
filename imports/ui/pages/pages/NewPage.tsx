import React, { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { call, parseTitle } from '/imports/api/_utils/shared';
import { pageTitlesAtom, roleAtom } from '/imports/state';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { message } from '/imports/ui/generic/message';

import PageForm from './PageForm';

export default function NewPage() {
  const role = useAtomValue(roleAtom);
  const setPageTitles = useSetAtom(pageTitlesAtom);
  const [newEntryTitleWithId, setNewEntryTitleWithId] = useState<string | null>(
    null
  );

  const createPage = async (newPage: any) => {
    try {
      const newPageId = await call('createPage', newPage);
      setPageTitles(await call('getPageTitles'));
      setNewEntryTitleWithId(`${parseTitle(newPage.title)}--${newPageId}`);
    } catch (error: any) {
      message.error(error.reason || error.error);
    }
  };

  if (role !== 'admin') {
    return null;
  }

  return (
    <SuccessRedirector context="info" ping={newEntryTitleWithId}>
      <PageForm onFinalize={createPage} />
    </SuccessRedirector>
  );
}
