import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message } from '../../components/message';
import Paginate from '../../components/Paginate';
import NewGridThumb from '../../components/NewGridThumb';
import NewEntryHelper from '../../components/NewEntryHelper';

function MemberGroups({ currentHost, isFederationLayout = false, isSelfAccount, user }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = user;

  useEffect(() => {
    Meteor.call('getGroupsByUser', username, (error, respond) => {
      if (error) {
        message(error);
        setLoading(false);
        return;
      }
      setGroups(respond);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!groups || groups.length === 0) {
    if (isSelfAccount) {
      return <NewEntryHelper buttonLink="/groups/new" isEmptyListing />;
    }
    return null;
  }

  return (
    <>
      <Paginate centerItems items={groups}>
        {(group) => {
          const isExternal = group.host !== currentHost.host;
          return (
            <Box key={group._id}>
              {isExternal ? (
                <a href={`https://${group.host}/group/${group._id}`}>
                  <NewGridThumb
                    host={isFederationLayout && group.host}
                    imageUrl={group.imageUrl}
                    subTitle={group.readingMaterial}
                    title={group.title}
                  />
                </a>
              ) : (
                <Link to={`/group/${group._id}`}>
                  <NewGridThumb
                    host={isFederationLayout && group.host}
                    imageUrl={group.imageUrl}
                    subTitle={group.readingMaterial}
                    title={group.title}
                  />
                </Link>
              )}
            </Box>
          );
        }}
      </Paginate>
      {isSelfAccount && (
        <Box p="4">
          <NewEntryHelper buttonLink="/groups/new" />
        </Box>
      )}
    </>
  );
}

export default MemberGroups;
