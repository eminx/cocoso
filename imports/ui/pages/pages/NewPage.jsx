import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';

import { call, parseTitle } from '../../utils/shared';
import PageForm from './PageForm';
import { PageContext } from './Page';
import { currentUserAtom, pageTitlesAtom } from '../../LayoutContainer';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';

export default function NewPage() {
  const currentUser = useAtomValue(currentUserAtom);
  const setPageTitles = useSetAtom(pageTitlesAtom);
  const [newEntryTitle, setNewEntryTitle] = useState(null);
  const { getPages } = useContext(PageContext);
  const navigate = useNavigate();

  const createPage = async (newPage) => {
    try {
      await call('createPage', newPage);
      await getPages();
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
