import React from 'react';
import { useLoaderData } from 'react-router';

import ComposablePageHybrid from '/imports/ui/entry/ComposablePageHybrid';

export default function ComposablePageHandler({ Host, pageTitles }) {
  const { composablePage } = useLoaderData();

  if (!composablePage || !composablePage.isPublished) {
    return null;
  }

  return <ComposablePageHybrid Host={Host} composablePage={composablePage} />;
}
