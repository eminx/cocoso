import React from 'react';
import { useLoaderData } from 'react-router';

import ComposablePageHybrid from '/imports/ui/entry/ComposablePageHybrid';

export default function ComposablePageHandler({ Host, pageTitles }) {
  const { composablePage } = useLoaderData();
  // if (href === '/' && !composablePageId) {
  //   composablePageId = Host?.settings?.menu[0]?.name;
  // }

  if (!composablePage || !composablePage.isPublished) {
    return null;
  }

  return (
    <WrapperHybrid Host={Host} pageTitles={pageTitles}>
      {({ rendered }) => (
        <ComposablePageHybrid Host={Host} composablePage={composablePage} />
      )}
    </WrapperHybrid>
  );
}
