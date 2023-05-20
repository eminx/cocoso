import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message } from '../../components/message';
import NewGridThumb from '../../components/NewGridThumb';
import Paginate from '../../components/Paginate';
import NewEntryHelper from '../../components/NewEntryHelper';

function MemberWorks({ isDesktop, isSelfAccount, user }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { username } = user;

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
    if (isSelfAccount) {
      return <NewEntryHelper buttonLink="/works/new" isEmptyListing />;
    }
    return null;
  }

  return (
    <>
      <Paginate centerItems={!isDesktop} items={works}>
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
    </>
  );
}

export default MemberWorks;
