import React from 'react';
import { useLoaderData } from 'react-router';

import UsersHybrid from '/imports/ui/listing/UsersHybrid';
import { Host as HostType } from '/imports/ui/types';

export default function UserListHandler({ Host }: { Host: HostType }) {
  const { keywords, users } = useLoaderData();

  return <UsersHybrid Host={Host} keywords={keywords} users={users} />;
}
