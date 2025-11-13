import React from 'react';
import { Link, useLoaderData } from 'react-router';

import { Box } from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import Paginate from '/imports/ui/listing/Paginate';
import NewGridThumb from '/imports/ui/listing/NewGridThumb';

export default function MemberWorks({ Host, isPortalHost }) {
  const { works } = useLoaderData();

  if (!works || works.length === 0) {
    return null;
  }

  return (
    <Paginate items={works}>
      {(work) => {
        const isExternal = work.host !== Host.host;
        return (
          <Box key={work._id}>
            {isExternal ? (
              <a
                href={`https://${work.host}/@${work.authorUsername}/works/${work._id}/info`}
              >
                <NewGridThumb
                  avatar={{
                    name: work.authorUsername,
                    url: work.authorAvatar,
                  }}
                  host={isPortalHost && work.host}
                  imageUrl={work.images[0]}
                  tag={work.category?.label}
                  title={work.title}
                />
              </a>
            ) : (
              <Link to={`/@${work.authorUsername}/works/${work._id}/info`}>
                <NewGridThumb
                  avatar={{
                    name: work.authorUsername,
                    url: work.authorAvatar,
                  }}
                  host={isPortalHost && work.host}
                  imageUrl={work.images[0]}
                  tag={work.category?.label}
                  title={work.title}
                />
              </Link>
            )}
          </Box>
        );
      }}
    </Paginate>
  );
}
