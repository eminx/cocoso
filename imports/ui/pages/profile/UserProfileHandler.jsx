import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import UserHybrid from '/imports/ui/entry/UserHybrid';
import { renderedAtom } from '/imports/state';

const UserInteractionHandler = lazy(() =>
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
