import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';

import { call, parseTitle } from '/imports/api/_utils/shared';
import { currentUserAtom, pageTitlesAtom } from '/imports/state';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { message } from '/imports/ui/generic/message';

import PageForm from './PageForm';
import { pagesAtom } from './PageItemHandler';

export default function NewPage() {
  const currentUser = useAtomValue(currentUserAtom);
  const setPageTitles = useSetAtom(pageTitlesAtom);
  const setPages = useSetAtom(pagesAtom);
  const [newEntryTitle, setNewEntryTitle] = useState(null);
  const navigate = useNavigate();

  const createPage = async (newPage) => {
    try {
      await call('createPage', newPage);
      setPages(await call('getPages'));
      setPageTitles(await call('getPageTitles'));
      setNewEntryTitle(newPage.title);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleSuccess = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/info/${parseTitle(newEntryTitle)}`);
  };

  return (
    <SuccessRedirector ping={newEntryTitle} onSuccess={handleSuccess}>
      <PageForm onFinalize={createPage} />
    </SuccessRedirector>
  );
}
