import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message } from '../../components/message';
import NewGridThumb from '../../components/NewGridThumb';
import Paginate from '../../components/Paginate';
import NewEntryHelper from '../../components/NewEntryHelper';

function MemberWorks({ currentHost, isFederationLayout = false, isSelfAccount, user }) {
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
      <Paginate centerItems items={works}>
        {(work) => {
          const isExternal = work.host !== currentHost.host;
          return (
            <Box key={work._id}>
              {isExternal ? (
                <a href={`https://${work.host}/@${work.authorUsername}/works/${work._id}`}>
                  <NewGridThumb
                    avatar={{
                      name: work.authorUsername,
                      url: work.authorAvatar,
                    }}
                    host={isFederationLayout && work.host}
                    imageUrl={work.images[0]}
                    tag={work.category?.label}
                    title={work.title}
                  />
                </a>
              ) : (
                <Link to={`/@${work.authorUsername}/works/${work._id}`}>
                  <NewGridThumb
                    avatar={{
                      name: work.authorUsername,
                      url: work.authorAvatar,
                    }}
                    host={isFederationLayout && work.host}
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
      {isSelfAccount && (
        <Box p="4">
          <NewEntryHelper buttonLink="/works/new" />
        </Box>
      )}
    </>
  );
}

export default MemberWorks;
