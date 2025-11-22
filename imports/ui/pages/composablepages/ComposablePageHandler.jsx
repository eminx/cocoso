import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import ComposablePageHybrid from '/imports/ui/entry/ComposablePageHybrid';
import { roleAtom } from '/imports/state';

export default function ComposablePageHandler({ Host, pageTitles }) {
  const { composablePage } = useLoaderData();
  const role = useAtomValue(roleAtom);

  if (!composablePage || (!composablePage.isPublished && role !== 'admin')) {
    return null;
  }

  return <ComposablePageHybrid Host={Host} composablePage={composablePage} />;
}
