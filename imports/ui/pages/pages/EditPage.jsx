import React, { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import PageForm from './PageForm';
import { PageContext } from './Page';
import { call } from '../../utils/shared';
import SuccessRedirector from '../../forms/SuccessRedirector';
import { message } from '../../generic/message';
import { StateContext } from '../../LayoutContainer';

export default function EditPage() {
  const [updated, setUpdated] = useState(null);
  const { currentPage, getPages } = useContext(PageContext);
  const { getPageTitles } = useContext(StateContext);
  const [, setSearchParams] = useSearchParams();

  const updatePage = async (newPage) => {
    const pageId = currentPage._id;

    try {
      await call('updatePage', pageId, newPage);
      await getPageTitles();
      await getPages();
      setUpdated(pageId);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const pageFields = (({ images, longDescription, title }) => ({
    images,
    longDescription,
    title,
  }))(currentPage);

  if (!currentPage) {
    return null;
  }

  return (
    <SuccessRedirector ping={updated} onSuccess={() => setSearchParams({ edit: 'false' })}>
      <PageForm page={pageFields} onFinalize={updatePage} />
    </SuccessRedirector>
  );
}
