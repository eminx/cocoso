import React, { lazy } from 'react';
import { useLoaderData } from 'react-router';
import { atom, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

import WrapperHybrid from '/imports/ui/layout/WrapperHybrid';
import ResourceHybrid from '/imports/ui/entry/ResourceHybrid';
import { renderedAtom } from '/imports/state';

const ResourceInteractionHandler = lazy(() =>
  import('./components/ResourceInteractionHandler')
);
// const EditResource = lazy(() => import('./EditResource'));
// const NewEntryHandler = lazy(() =>
//   import('/imports/ui/listing/NewEntryHandler')
// );

export const resourceAtom = atom(null);

export default function ResourceItemHandler({ Host, pageTitles }) {
  const { documents, resource } = useLoaderData();
  useHydrateAtoms([[resourceAtom, resource]]);
  const rendered = useAtomValue(renderedAtom);

  return (
    <>
      <ResourceHybrid documents={documents} resource={resource} Host={Host} />
      {rendered && (
        <ResourceInteractionHandler resource={resource} />
        // <NewEntryHandler>
        //   <EditResource />
        // </NewEntryHandler>
      )}
    </>
  );
}
