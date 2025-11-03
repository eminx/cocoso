import React, { useEffect, useState } from 'react';
import { Outlet, useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import { currentHostAtom } from '/imports/state';
import { Heading } from '/imports/ui/core';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';

// import ComposablePagesListing from './components/ComposablePagesListing';
// import ComposablePageCreator from './components/ComposablePageCreator';
import ComposablePageForm from './ComposablePageForm';

export default function ComposablePages() {
  const currentHost = useAtomValue(currentHostAtom);
  const { composablePageTitles } = useLoaderData();

  return (
    <>
      {/* <TopToolBar composablePageTitles={composablePageTitles} /> */}

      <Outlet />
      <ComposablePageForm composablePageTitles={composablePageTitles} />
    </>
  );
}
