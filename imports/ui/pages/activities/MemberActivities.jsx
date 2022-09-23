import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Center, HStack, Heading, Image, Tag, TagLabel, Text } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import Paginate from '../../components/Paginate';
import PublicActivityThumb from '../../components/PublicActivityThumb';

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
                <PublicActivityThumb item={activity} />
              </Link>
            </Box>
          )}
        </Paginate>
      )}
    </Box>
  );
}

const ActivityItem = ({ act }) => {
  const [t] = useTranslation('activities');

  return (
    <HStack align="flex-start" bg="white" p="3" w="100%">
      {act.isPublicActivity && (
        <Box p="2">
          <Image fit="cover" w="xs" fill src={act.imageUrl} />
        </Box>
      )}
      <Box w="100%">
        <Heading mb="2" overflowWrap="anywhere" size="md">
          {act.title}
        </Heading>
        <Tag>
          <TagLabel>{act.resource}</TagLabel>
        </Tag>
        <Text fontWeight="light">{act.subTitle}</Text>
        <Text fontStyle="italic" p="1" textAlign="right">
          {act.datesAndTimes.length} {t('members.occurences')}
        </Text>
      </Box>
    </HStack>
  );
};

export default MemberActivities;
