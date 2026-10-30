import React from 'react';
import { useLoaderData } from 'react-router';

import UsersHybrid from '/imports/ui/listing/UsersHybrid';

export default function UserListHandler({ Host }) {
  const { keywords, users } = useLoaderData();

  return <UsersHybrid Host={Host} keywords={keywords} users={users} />;
}
