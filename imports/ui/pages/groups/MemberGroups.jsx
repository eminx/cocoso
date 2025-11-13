import React from 'react';
import { Link, useLoaderData } from 'react-router';

import { Box } from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import Paginate from '/imports/ui/listing/Paginate';
import NewGridThumb from '/imports/ui/listing/NewGridThumb';

function MemberGroups({ Host, isPortalHost }) {
  const { groups } = useLoaderData();

  if (!groups || groups.length === 0) {
    return null;
  }

  return (
    <Paginate items={groups}>
      {(group) => {
        const isExternal = group.host !== Host.host;
        return (
          <Box key={group._id}>
            {isExternal ? (
              <a href={`https://${group.host}/groups/${group._id}/info`}>
                <NewGridThumb
                  host={isPortalHost && group.host}
                  imageUrl={group.imageUrl}
                  subTitle={group.readingMaterial}
                  title={group.title}
                />
              </a>
            ) : (
              <Link to={`/groups/${group._id}/info`}>
                <NewGridThumb
                  host={isPortalHost && group.host}
                  imageUrl={group.imageUrl}
                  subTitle={group.readingMaterial}
                  title={group.title}
                />
              </Link>
            )}
          </Box>
        );
      }}
    </Paginate>
  );
}

export default MemberGroups;
