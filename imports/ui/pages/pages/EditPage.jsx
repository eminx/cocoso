import React, { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import PageForm from './PageForm';
import { PageContext } from './Page';
import { call, parseTitle } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';
import { StateContext } from '../../LayoutContainer';

export default function EditPage() {
  const [updated, setUpdated] = useState(null);
  const [newPageTitle, setNewPageTitle] = useState(null);
  const { currentPage, getPages } = useContext(PageContext);
  const { getPageTitles } = useContext(StateContext);
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
      await getPageTitles();
      await getPages();
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
