import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import UserHybrid from '/imports/ui/entry/UserHybrid';

const UserInteractionHandler = lazy(() =>
  import('./components/UserInteractionHandler')
);

export default function UserProfileHandler({ Host, pageTitles }) {
  const { user } = useLoaderData();

  return (
    <WrapperHybrid isEntryPage Host={Host} pageTitles={pageTitles}>
      {({ rendered }) => (
        <>
          <UserHybrid Host={Host} user={user} />
          {rendered && (
            <UserInteractionHandler user={user} slideStart={rendered} />
          )}
        </>
      )}
    </WrapperHybrid>
  );
}
