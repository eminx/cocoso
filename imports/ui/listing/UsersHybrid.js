import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';

import PageHeading from '../components/PageHeading';
import PopupHandler from './PopupHandler';
import InfiniteScroller from '../components/InfiniteScroller';
import MemberAvatarEtc from '../components/MemberAvatarEtc';

export default function UsersHybrid({ users, Host }) {
  const [modalItem, setModalItem] = useState(null);

  const usersInMenu = Host?.settings?.menu?.find((item) => item.name === 'people');
  const description = usersInMenu?.description;
  const heading = usersInMenu?.label;

  return (
    <>
      <PageHeading description={description} heading={heading} />

      <Box px="2">
        <InfiniteScroller isMasonry items={users}>
          {(user) => (
            <Box key={user.username} cursor="pointer" onClick={() => setModalItem(user)}>
              <MemberAvatarEtc isThumb user={user} />
            </Box>
          )}
        </InfiniteScroller>

        {modalItem && (
          <PopupHandler item={modalItem} kind="users" onClose={() => setModalItem(null)} />
        )}
      </Box>
    </>
  );
}
