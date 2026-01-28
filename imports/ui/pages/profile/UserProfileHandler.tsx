import React from 'react';
import loadable from '@loadable/component';
import { Outlet, useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import UserHybrid from '/imports/ui/entry/UserHybrid';
import { renderedAtom } from '/imports/state';

const UserInteractionHandler = loadable(() =>
  import('./components/UserInteractionHandler')
);

export default function UserProfileHandler({ Host, pageTitles }) {
  const { user } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);

  return (
    <>
      <UserHybrid Host={Host} user={user} />
      {rendered && <UserInteractionHandler user={user} slideStart={rendered} />}
    </>
  );
}
