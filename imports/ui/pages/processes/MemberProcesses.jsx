import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message } from '../../components/message';
import Paginate from '../../components/Paginate';
import NewGridThumb from '../../components/NewGridThumb';
import NewEntryHelper from '../../components/NewEntryHelper';

function MemberProcesses({
  currentHost,
  isDesktop,
  isFederationLayout = false,
  isSelfAccount,
  user,
}) {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = user;

  useEffect(() => {
    Meteor.call('getProcessesByUser', username, (error, respond) => {
      if (error) {
        message(error);
        setLoading(false);
        return;
      }
      setProcesses(respond);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!processes || processes.length === 0) {
    if (isSelfAccount) {
      return <NewEntryHelper buttonLink="/processes/new" isEmptyListing />;
    }
    return null;
  }

  const getItemLink = (item) => {
    if (item.host === currentHost.host) {
      return `/processes/${item._id}`;
    } else {
      window.location.href = `https://${item.host}/processes/${item._id}`;
    }
  };

  return (
    <>
      <Paginate centerItems={!isDesktop} items={processes}>
        {(process) => (
          <Box key={process._id}>
            <Link to={getItemLink(process)}>
              <NewGridThumb
                host={isFederationLayout && process.host}
                imageUrl={process.imageUrl}
                subTitle={process.readingMaterial}
                title={process.title}
              />
            </Link>
          </Box>
        )}
      </Paginate>
      {isSelfAccount && (
        <Box p="4">
          <NewEntryHelper buttonLink="/processes/new" />
        </Box>
      )}
    </>
  );
}

export default MemberProcesses;
