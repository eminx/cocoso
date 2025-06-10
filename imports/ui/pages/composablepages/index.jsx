import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Trans } from 'react-i18next';

import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import ComposablePageForm from './ComposablePageForm';
import ComposablePagesListing from './components/ComposablePagesListing';
import ComposablePageCreator from '/imports/ui/pages/composablepages/components/ComposablePageCreator';
import { Heading } from '/imports/ui/core';

export default function ComposablePages() {
  const { currentHost } = useContext(StateContext);
  const [composablePageTitles, setComposablePageTitles] = useState([]);

  const getComposablePageTitles = async () => {
    try {
      const response = await call('getComposablePageTitles');
      setComposablePageTitles(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getComposablePageTitles();
  }, []);

  return (
    <>
      <Heading css={{ fontWeight: 'light' }} mb="6" size="sm">
        <Trans i18nKey="admin:composable.description" />
      </Heading>

      <Routes>
        <Route
          path=":composablePageId"
          element={
            <ComposablePageForm
              composablePageTitles={composablePageTitles}
              getComposablePageTitles={getComposablePageTitles}
            />
          }
        />
      </Routes>
    </>
  );
}
