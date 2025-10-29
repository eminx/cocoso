import React, { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useSetAtom } from 'jotai';

import PageForm from './PageForm';
import { PageContext } from './PageItemHandler';
import { call, parseTitle } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';
import { pageTitlesAtom } from '../../../state';

export default function EditPage() {
  const setPageTitles = useSetAtom(pageTitlesAtom);
  const [updated, setUpdated] = useState(null);
  const [newPageTitle, setNewPageTitle] = useState(null);
  const { currentPage, getPages } = useContext(PageContext);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const handleSuccess = () => {
    navigate(`/info/${parseTitle(newPageTitle)}`);
  };

  const updatePage = async (newPage) => {
    const pageId = currentPage._id;
    setNewPageTitle('new title:', newPage.title);

    try {
      await call('updatePage', pageId, newPage);
      setPageTitles(await call('getPageTitles'));
      setUpdated(pageId);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const pageFields = currentPage && {
    images: currentPage.images,
    longDescription: currentPage.longDescription,
    order: currentPage.order,
    title: currentPage.title,
  };

  return (
    <SuccessRedirector ping={updated} onSuccess={() => handleSuccess()}>
      <PageForm page={pageFields} onFinalize={updatePage} />
    </SuccessRedirector>
  );
}
