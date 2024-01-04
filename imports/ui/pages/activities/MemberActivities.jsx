import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message } from '../../components/message';
import Paginate from '../../components/Paginate';
import NewGridThumb from '../../components/NewGridThumb';
import NewEntryHelper from '../../components/NewEntryHelper';

function MemberActivities({
  currentHost,
  isDesktop,
  isFederationLayout = false,
  isSelfAccount,
  user,
}) {
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

  const getItemLink = (item) => {
    if (item.host === currentHost.host) {
      return `/activities/${item._id}`;
    } else {
      window.location.href = `https://${item.host}/activities/${item._id}`;
    }
  };

  return (
    <>
      <Paginate centerItems={!isDesktop} items={publicActivities}>
        {(activity) => (
          <Box key={activity._id}>
            <Link to={getItemLink(activity)}>
              <NewGridThumb
                host={isFederationLayout && activity.host}
                imageUrl={activity.imageUrl}
                title={activity.title}
                subTitle={activity.isProcess ? activity.readingMaterial : activity.subTitle}
              />
            </Link>
          </Box>
        )}
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
