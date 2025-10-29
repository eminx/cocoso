import React from 'react';
import { useLoaderData } from 'react-router';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import ResourcesHybrid from '/imports/ui/listing/ResourcesHybrid';
// import NewEntryHandler from '/imports/ui/listing/NewEntryHandler';
// import NewResource from './NewResource';

export default function ResourceListHandler({ Host, pageTitles }) {
  const { documents, resources } = useLoaderData();

  return (
    <WrapperHybrid Host={Host} pageTitles={pageTitles}>
      {({ rendered }) => (
        <>
          <ResourcesHybrid
            documents={documents}
            resources={resources}
            Host={Host}
          />
          {/* {rendered ? (
            <NewEntryHandler>
              <NewResource />
            </NewEntryHandler>
          ) : null} */}
        </>
      )}
    </WrapperHybrid>
  );
}
