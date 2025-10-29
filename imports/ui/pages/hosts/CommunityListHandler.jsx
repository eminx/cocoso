import React from 'react';
import { useLoaderData } from 'react-router';

export default function CommunityListHandler({ Host, pageTitles }) {
  const { hosts } = useLoaderData();

  return (
    <WrapperHybrid Host={Host} pageTitles={pageTitles}>
      {({ rendered }) => <CommunitiesHybrid Host={Host} hosts={hosts} />}
    </WrapperHybrid>
  );
}
