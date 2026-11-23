import React from 'react';
// @ts-expect-error: @loadable/component does not provide declarations in this project.
import loadable from '@loadable/component';
import { useLoaderData } from 'react-router';
import { useAtomValue } from 'jotai';

import { Box } from '/imports/ui/core';
import UserHybrid from '/imports/ui/entry/UserHybrid';
import { currentUserAtom, renderedAtom } from '/imports/state';
import EntryReporter from '/imports/ui/entry/EntryReporter';
import type { Host } from '/imports/ui/types';

const UserInteractionHandler = loadable(
  () => import('./components/UserInteractionHandler')
);

export default function UserProfileHandler({ Host }: { Host: Host }) {
  const { user } = useLoaderData();
  const rendered = useAtomValue(renderedAtom);
  const currentUser = useAtomValue(currentUserAtom);

  return (
    <>
      <UserHybrid Host={Host} user={user} />
      {rendered && (
        <>
          <UserInteractionHandler user={user} slideStart={rendered} />

          {currentUser && (
            <Box pt="24">
              <EntryReporter
                contentId={user._id}
                contentType="users"
                reportedUserId={user._id}
                reportedTitle={user.username}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}
