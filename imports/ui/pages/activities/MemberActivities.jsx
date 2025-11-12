import React from 'react';
import { Link, useLoaderData } from 'react-router';

import { Box } from '/imports/ui/core';
import { message } from '/imports/ui/generic/message';
import Paginate from '/imports/ui/listing/Paginate';
import NewGridThumb from '/imports/ui/listing/NewGridThumb';

export default function MemberActivities({ Host, isPortalHost }) {
  const { activities } = useLoaderData();

  if (!activities || activities.length === 0) {
    return null;
  }

  const publicActivities = activities.filter((item) => item.isPublicActivity);

  return (
    <Paginate items={publicActivities}>
      {(activity) => {
        const isExternal = activity.host !== Host.host;
        return (
          <Box key={activity._id}>
            {isExternal ? (
              <a
                href={`https://${activity.host}/activities/${activity._id}/info`}
              >
                <NewGridThumb
                  host={isPortalHost && activity.host}
                  imageUrl={activity.imageUrl}
                  title={activity.title}
                  subTitle={
                    activity.isGroup
                      ? activity.readingMaterial
                      : activity.subTitle
                  }
                />
              </a>
            ) : (
              <Link to={`/activities/${activity._id}/info`}>
                <NewGridThumb
                  host={isPortalHost && activity.host}
                  imageUrl={activity.imageUrl}
                  title={activity.title}
                  subTitle={
                    activity.isGroup
                      ? activity.readingMaterial
                      : activity.subTitle
                  }
                />
              </Link>
            )}
          </Box>
        );
      }}
    </Paginate>
  );
}
