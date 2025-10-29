import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import UsersHybrid from '/imports/ui/listing/UsersHybrid';

export default function UserListHandler({ Host, pageTitles }) {
  const { keywords, users } = useLoaderData();

  return (
    <WrapperHybrid Host={Host} pageTitles={pageTitles}>
      {({ rendered }) => (
        <UsersHybrid Host={Host} keywords={keywords} users={users} />
      )}
    </WrapperHybrid>
  );
}
