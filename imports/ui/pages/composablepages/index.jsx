import React, { useEffect, useState } from 'react';
import { Outlet, useLoaderData } from 'react-router';
import { atom, useAtomValue, useSetAtom } from 'jotai';

import { currentHostAtom } from '/imports/state';

import ComposablePagesListing from './components/ComposablePagesListing';
import ComposablePageCreator from './components/ComposablePageCreator';

export const composablePageTitlesAtom = atom([]);

export default function ComposablePages() {
  const currentHost = useAtomValue(currentHostAtom);
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
      <ComposablePagesListing />
    </>
  );
}
