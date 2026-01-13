import React, { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { call, parseTitle } from '/imports/api/_utils/shared';
import SuccessRedirector from '/imports/ui/forms/SuccessRedirector';
import { message } from '/imports/ui/generic/message';
import { pageTitlesAtom, roleAtom } from '/imports/state';

import PageForm from './PageForm';
import { currentPageAtom, pagesAtom } from './PageItemHandler';

export default function EditPage() {
  const [updated, setUpdated] = useState<string | null>(null);
  const setPageTitles = useSetAtom(pageTitlesAtom);
  const currentPage = useAtomValue(currentPageAtom);
  const role = useAtomValue(roleAtom);
  const [pages, setPages] = useAtom(pagesAtom);

  const updatePage = async (newPage: any) => {
    const pageId = currentPage?._id;

    try {
      await call('updatePage', pageId, newPage);
      setPages(await call('getPages'));
      setPageTitles(await call('getPageTitles'));
      setUpdated(parseTitle(newPage.title));
      setTimeout(() => {
        setUpdated(null);
      }, 1000);
    } catch (error: any) {
      message.error(error.reason || error.error);
    }
  };

  if (!currentPage || role !== 'admin') {
    return null;
  }

  const pageFields = {
    images: currentPage.images,
    longDescription: currentPage.longDescription,
    order: currentPage.order,
    title: currentPage.title,
  };

  return (
    <SuccessRedirector context="info" ping={updated}>
      <PageForm page={pageFields} onFinalize={updatePage} />
    </SuccessRedirector>
  );
}
