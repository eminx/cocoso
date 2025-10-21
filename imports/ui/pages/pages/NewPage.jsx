import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';

import { call, parseTitle } from '../../utils/shared';
import PageForm from './PageForm';
import { PageContext } from './Page';
import { StateContext } from '../../LayoutContainer';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';

export default function NewPage() {
  const [newEntryTitle, setNewEntryTitle] = useState(null);
  const { currentUser, getPageTitles } = useContext(StateContext);
  const { getPages } = useContext(PageContext);
  const navigate = useNavigate();

  const createPage = async (newPage) => {
    try {
      await call('createPage', newPage);
      await getPageTitles();
      await getPages();
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
