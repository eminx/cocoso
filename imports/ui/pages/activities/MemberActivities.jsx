import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import Paginate from '../../components/Paginate';
import NewGridThumb from '../../components/NewGridThumb';

function MemberActivities({ isDesktop, match }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const { username } = match.params;

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

  if (!activities || activities.length === 0) {
    <Alert />;
  }

  const publicActivities = activities.filter((item) => item.isPublicActivity);

  if (!publicActivities || publicActivities.length === 0) {
    return null;
  }

  return (
    <>
      <Paginate centerItems={!isDesktop} items={publicActivities}>
        {(activity) => (
          <Box key={activity._id}>
            <Link to={`/activities/${activity._id}`}>
              <NewGridThumb
                imageUrl={activity.imageUrl}
                title={activity.title}
                subTitle={activity.isProcess ? activity.readingMaterial : activity.subTitle}
              />
            </Link>
          </Box>
        )}
      </Paginate>
    </>
  );
}

export default MemberActivities;
