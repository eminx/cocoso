import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router';
import { atom, useSetAtom } from 'jotai';

import ComposablePagesList from './components/ComposablePagesList';
import ComposablePageCreator from './components/ComposablePageCreator';

export const composablePageTitlesAtom = atom([]);

export default function ComposablePages() {
  const { composablePageTitles } = useLoaderData();
  const setComposablePageTitles = useSetAtom(composablePageTitlesAtom);

  useEffect(() => {
    if (composablePageTitles) {
      setComposablePageTitles(composablePageTitles);
    }
  }, [composablePageTitles]);

  return (
    <>
      <ComposablePageCreator />
      <ComposablePagesList />
    </>
  );
}
