import React from 'react';
import { useAtomValue } from 'jotai';

import { roleAtom } from '/imports/state';
import { Host } from '/imports/ui/types';
import NotFoundPage from '/imports/ui/pages/NotFoundPage';

import { getRenderPass } from './helpers';
import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
import ShowContentFromOtherHosts from './ShowContentFromOtherHosts';

interface ListingGenericHybridProps {
  Host: Host;
  isPortalHost: boolean;
  listing: string;
  modalItem?: any;
  showPast?: boolean;
  onCloseModal?: () => void;
  children: any;
}

export default function ListingGenericHybrid({
  Host,
  isPortalHost,
  listing,
  modalItem,
  showPast,
  onCloseModal,
  children,
}: ListingGenericHybridProps) {
  const role = useAtomValue(roleAtom);

  const renderPass: boolean = getRenderPass(Host, listing, role);

  if (!renderPass) {
    return <NotFoundPage />;
  }

  return (
    <>
      <PageHeading currentHost={Host} listing={listing} />

      {children}

      <ShowContentFromOtherHosts
        isPortalHost={isPortalHost}
        listing={listing}
      />

      <PopupHandler
        item={modalItem}
        listing={listing}
        showPast={showPast}
        onClose={onCloseModal}
      />
    </>
  );
}
