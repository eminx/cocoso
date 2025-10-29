import React from 'react';
import { useLoaderData } from 'react-router';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import GroupsHybrid from '/imports/ui/listing/GroupsHybrid';
// import NewEntryHandler from '/imports/ui/listing/NewEntryHandler';
// import NewGroup from './NewGroup';

export default function GroupListHandler({ Host, pageTitles }) {
  const { groups } = useLoaderData();

  return (
    // <WrapperHybrid Host={Host} pageTitles={pageTitles}>
    //   {({ rendered }) => (
    <>
      <GroupsHybrid groups={groups} Host={Host} />
      {/* {rendered ? (
            <NewEntryHandler>
              <NewGroup />
            </NewEntryHandler>
          ) : null} */}
    </>
    //   )}
    // </WrapperHybrid>
  );
}
