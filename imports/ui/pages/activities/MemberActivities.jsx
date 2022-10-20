import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import Paginate from '../../components/Paginate';
import NewGridThumb from '../../components/NewGridThumb';

function MemberActivities({ match }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [t] = useTranslation('activities');
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

  return (
    <Box justify="center" w="100%" mt="4">
      {publicActivities && publicActivities.length > 0 && (
        <Paginate items={publicActivities}>
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
      )}
    </Box>
  );
}

export default MemberActivities;
