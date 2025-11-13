import React, { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { call, parseTitle } from '/imports/api/_utils/shared';
import { pageTitlesAtom, roleAtom } from '/imports/state';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { message } from '/imports/ui/generic/message';

import PageForm from './PageForm';
import { pagesAtom } from './PageItemHandler';

export default function NewPage() {
  const role = useAtomValue(roleAtom);
  const setPageTitles = useSetAtom(pageTitlesAtom);
  const setPages = useSetAtom(pagesAtom);
  const [newEntryTitle, setNewEntryTitle] = useState(null);

  const createPage = async (newPage) => {
    try {
      await call('createPage', newPage);
      setPages(await call('getPages'));
      setPageTitles(await call('getPageTitles'));
      setNewEntryTitle(parseTitle(newPage.title));
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  if (role !== 'admin') {
    return null;
  }

  return (
    <SuccessRedirector context="info" ping={newEntryTitle}>
      <PageForm onFinalize={createPage} />
    </SuccessRedirector>
  );
}
