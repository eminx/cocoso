import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { call, parseTitle } from '/imports/api/_utils/shared';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { message } from '/imports/ui/generic/message';
import { pageTitlesAtom } from '/imports/state';

import PageForm from './PageForm';
import { currentPageAtom, pagesAtom } from './PageItemHandler';

export default function EditPage() {
  const setPageTitles = useSetAtom(pageTitlesAtom);
  const [updated, setUpdated] = useState(null);
  const [newPageTitle, setNewPageTitle] = useState(null);
  const currentPage = useAtomValue(currentPageAtom);
  const [pages, setPages] = useAtom(pagesAtom);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const handleSuccess = () => {
    navigate(`/info/${parseTitle(newPageTitle)}`);
  };

  const updatePage = async (newPage) => {
    const pageId = currentPage?._id;
    setNewPageTitle('new title:', newPage.title);

    try {
      await call('updatePage', pageId, newPage);
      setPages(await call('getPages'));
      setPageTitles(await call('getPageTitles'));
      setUpdated(pageId);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  if (!currentPage) {
    return null;
  }

  const pageFields = {
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
