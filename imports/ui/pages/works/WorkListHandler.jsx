import React from 'react';
import { useLoaderData } from 'react-router';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import WorksHybrid from '/imports/ui/listing/WorksHybrid';
// import NewEntryHandler from '/imports/ui/listing/NewEntryHandler';
// import NewWork from './NewWork';

export default function WorkListHandler({ Host, pageTitles }) {
  const { documents, works } = useLoaderData();

  return (
    <WrapperHybrid Host={Host} pageTitles={pageTitles}>
      {({ rendered }) => (
        <>
          <WorksHybrid Host={Host} documents={documents} works={works} />
          {/* {rendered ? (
            <NewEntryHandler>
              <NewWork />
            </NewEntryHandler>
          ) : null} */}
        </>
      )}
    </WrapperHybrid>
  );
}
