import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';
import { atom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import ResourceHybrid from '/imports/ui/entry/ResourceHybrid';

const ResourceInteractionHandler = lazy(() =>
  import('./components/ResourceInteractionHandler')
);
// const EditResource = lazy(() => import('./EditResource'));
// const NewEntryHandler = lazy(() =>
//   import('/imports/ui/listing/NewEntryHandler')
// );

export const resourceAtom = atom(null);

export default function ResourceItemHandler({ Host, pageTitles }) {
  const { resource } = useLoaderData();
  useHydrateAtoms([[resourceAtom, resource]]);

  return (
    <WrapperHybrid isEntryPage pageTitles={pageTitles} Host={Host}>
      {({ rendered }) => (
        <>
          <ResourceHybrid resource={resource} Host={Host} />
          {rendered && (
            <ResourceInteractionHandler resource={resource} />
            // <NewEntryHandler>
            //   <EditResource />
            // </NewEntryHandler>
          )}
        </>
      )}
    </WrapperHybrid>
  );
}
