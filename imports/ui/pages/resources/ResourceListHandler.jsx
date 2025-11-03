import React from 'react';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import ResourcesHybrid from '/imports/ui/listing/ResourcesHybrid';
import { renderedAtom } from '/imports/state';
// import NewEntryHandler from '/imports/ui/listing/NewEntryHandler';
// import NewResource from './NewResource';

export default function ResourceListHandler({ Host, pageTitles }) {
  const { documents, resources } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);

  return (
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
  );
}
