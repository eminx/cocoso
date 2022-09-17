import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import Paginate from '../../components/Paginate';
import GridThumb from '../../components/GridThumb';

function MemberProcesses({ match }) {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = match.params;

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
    <Alert />;
  }

  return (
    <Box justify="center" w="100%" mt="4">
      {processes && processes.length > 0 && (
        <Paginate items={processes}>
          {(process) => (
            <Box key={process._id}>
              <Link to={`/processes/${process._id}`}>
                <GridThumb image={process.imageUrl} large title={process.title}></GridThumb>
              </Link>
            </Box>
          )}
        </Paginate>
      )}
    </Box>
  );
}

export default MemberProcesses;
