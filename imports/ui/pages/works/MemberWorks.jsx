import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Heading, Image, Text, Wrap, WrapItem } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import WorkThumb from '../../components/WorkThumb';

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
    <Wrap justify="center" w="100%" mt="4">
      {works && works.length > 0 ? (
        works.map((work, index) => (
          <WrapItem key={work._id}>
            <Link key={work._id} to={`/@${work.authorUsername}/works/${work._id}`}>
              <Box mb="4">
                <WorkThumb work={work} />
              </Box>
            </Link>
          </WrapItem>
        ))
      ) : (
        <Box w="100%" bg="gray.600" p="2" align="center">
          <Heading level={4} margin="small">
            {t('message.activity.empty')}
          </Heading>
          <Box direction="row" align="center">
            <Image fit="contain" src="https://media.giphy.com/media/a0dG9NJaR2tQQ/giphy.gif" />
          </Box>
          <Text m="2">{t('message.activity.info', { username })}</Text>
        </Box>
      )}
    </Wrap>
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
