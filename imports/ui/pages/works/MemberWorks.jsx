import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Heading, Image, Text, Wrap, WrapItem } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import WorkThumb from '../../components/WorkThumb';
import Paginate from '../../components/Paginate';

function MemberWorks({ match, history }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(StateContext);

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
                <WorkThumb work={work} />
              </Link>
            </Box>
          )}
        </Paginate>
      )}
    </Box>
  );
}

const WorkItem = ({ work }) => (
  <Flex bg="white" p="2" w="100%">
    <Box mr="4">
      <Image boxSize="140px" h="180px" objectFit="cover" src={work.images && work.images[0]} />
    </Box>
    <Box>
      <Heading as="h3" size="md" mb="2" style={{ overflowWrap: 'anywhere' }}>
        {work.title}
      </Heading>
      <Text fontWeight="light">{work.shortDescription}</Text>
    </Box>
  </Flex>
);

export default MemberWorks;
