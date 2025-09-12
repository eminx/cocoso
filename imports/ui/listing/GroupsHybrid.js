import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Center } from '/imports/ui/core';

import PageHeading from './PageHeading';
import PopupHandler from './PopupHandler';
import VirtualGridLister from './VirtualGridLister';

export default function GroupsHybrid({ groups, Host }) {
  const [modalItem, setModalItem] = useState(null);
  const [tc] = useTranslation('common');

  const groupsInMenu = Host?.settings?.menu?.find(
    (item) => item.name === 'groups'
  );
  const description = groupsInMenu?.description;
  const heading = groupsInMenu?.label;
  const url = `${Host?.host}/${groupsInMenu?.name}`;
  const getTags = (item) => (item.isPrivate ? [tc('labels.private')] : null);

  return (
    <>
      <PageHeading
        description={description}
        heading={heading}
        imageUrl={Host?.logo}
        url={url}
      />

      <Center>
        <VirtualGridLister
          cellProps={{ Host, getTags, setModalItem }}
          items={groups}
        />
      </Center>

      {modalItem && (
        <PopupHandler
          item={modalItem}
          kind="groups"
          onClose={() => setModalItem(null)}
        />
      )}
    </>
  );
}
