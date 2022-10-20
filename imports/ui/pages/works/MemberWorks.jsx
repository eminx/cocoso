import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import NewGridThumb from '../../components/NewGridThumb';
import Paginate from '../../components/Paginate';

function MemberWorks({ match }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [t] = useTranslation('members');
  const { username } = match.params;

  useEffect(() => {
    Meteor.call('getWorksByUser', username, (error, respond) => {
      if (error) {
        message(error);
        setLoading(false);
        return;
      }
      setWorks(respond);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!works || works.length === 0) {
    <Alert />;
  }

  return (
    <Box justify="center" w="100%" mt="4">
      {works && works.length > 0 && (
        <Paginate items={works}>
          {(work) => (
            <Box key={work._id}>
              <Link to={`/@${work.authorUsername}/works/${work._id}`}>
                <NewGridThumb
                  avatar={{
                    name: work.authorUsername,
                    url: work.authorAvatar,
                  }}
                  imageUrl={work.images[0]}
                  tag={work.category?.label}
                  title={work.title}
                />
              </Link>
            </Box>
          )}
        </Paginate>
      )}
    </Box>
  );
}

export default MemberWorks;
