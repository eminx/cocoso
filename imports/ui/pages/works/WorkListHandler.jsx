import React from 'react';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import WorksHybrid from '/imports/ui/listing/WorksHybrid';
import { renderedAtom } from '/imports/state';
// import NewEntryHandler from '/imports/ui/listing/NewEntryHandler';
// import NewWork from './NewWork';

export default function WorkListHandler({ Host, pageTitles }) {
  const { documents, works } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);

  return (
    <>
      <WorksHybrid Host={Host} documents={documents} works={works} />
      {/* {rendered ? (
            <NewEntryHandler>
              <NewWork />
            </NewEntryHandler>
          ) : null} */}
    </>
  );
}
