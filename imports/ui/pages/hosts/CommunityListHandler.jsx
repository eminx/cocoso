import React from 'react';
import { useLoaderData } from 'react-router';

import CommunitiesHybrid from '/imports/ui/pages/hosts/CommunitiesHybrid';

export default function CommunityListHandler({ Host, pageTitles }) {
  const { hosts } = useLoaderData();

  return <CommunitiesHybrid Host={Host} hosts={hosts} />;
}
