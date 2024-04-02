import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message } from '../../components/message';
import Paginate from '../../components/Paginate';
import NewGridThumb from '../../components/NewGridThumb';
import NewEntryHelper from '../../components/NewEntryHelper';

function MemberActivities({ currentHost, isFederationLayout = false, isSelfAccount, user }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const { username } = user;

  useEffect(() => {
    Meteor.call('getActivitiesByUser', username, (error, respond) => {
      if (error) {
        message(error);
        setLoading(false);
        return;
      }
      setActivities(respond);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  const publicActivities = activities.filter((item) => item.isPublicActivity);

  if (!publicActivities || publicActivities.length === 0) {
    if (isSelfAccount) {
      return <NewEntryHelper buttonLink="/activities/new" isEmptyListing />;
    }
    return null;
  }

  return (
    <>
      <Paginate centerItems items={publicActivities}>
        {(activity) => {
          const isExternal = activity.host !== currentHost.host;
          return (
            <Box key={activity._id}>
              {isExternal ? (
                <a href={`https://${activity.host}/activities/${activity._id}`}>
                  <NewGridThumb
                    host={isFederationLayout && activity.host}
                    imageUrl={activity.imageUrl}
                    title={activity.title}
                    subTitle={activity.isProcess ? activity.readingMaterial : activity.subTitle}
                  />
                </a>
              ) : (
                <Link to={`/activities/${activity._id}`}>
                  <NewGridThumb
                    host={isFederationLayout && activity.host}
                    imageUrl={activity.imageUrl}
                    title={activity.title}
                    subTitle={activity.isProcess ? activity.readingMaterial : activity.subTitle}
                  />
                </Link>
              )}
            </Box>
          );
        }}
      </Paginate>
      {isSelfAccount && (
        <Box p="4">
          <NewEntryHelper buttonLink="/activities/new" />
        </Box>
      )}
    </>
  );
}

export default MemberActivities;
