import React from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { useAtomValue } from 'jotai';

import ComposablePageHybrid from '/imports/ui/entry/ComposablePageHybrid';
import BottomToolbar from './components/BottomToolbar';
import { roleAtom } from '/imports/state';
import type { Host } from '/imports/ui/types';

export default function ComposablePageHandler({ Host }: { Host: Host }) {
  const { composablePage } = useLoaderData();
  const role = useAtomValue(roleAtom);
  const { revalidate } = useRevalidator();

  if (!composablePage || (!composablePage.isPublished && role !== 'admin')) {
    return null;
  }

  return (
    <>
      <ComposablePageHybrid Host={Host} composablePage={composablePage} />
      {role === 'admin' && (
        <BottomToolbar
          currentPage={composablePage}
          getComposablePageById={revalidate}
          isPublicView
        />
      )}
    </>
  );
}
