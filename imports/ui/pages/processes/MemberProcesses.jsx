import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message } from '../../components/message';
import Paginate from '../../components/Paginate';
import NewGridThumb from '../../components/NewGridThumb';
import NewEntryHelper from '../../components/NewEntryHelper';

function MemberProcesses({ isDesktop, isSelfAccount, user }) {
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

  return (
    <>
      <Paginate centerItems={!isDesktop} items={processes}>
        {(process) => (
          <Box key={process._id}>
            <Link to={`/processes/${process._id}`}>
              <NewGridThumb
                imageUrl={process.imageUrl}
                subTitle={process.readingMaterial}
                title={process.title}
              />
            </Link>
          </Box>
        )}
      </Paginate>
    </>
  );
}

export default MemberProcesses;
