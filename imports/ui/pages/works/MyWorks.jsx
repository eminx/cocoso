import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import NiceList from '../../components/NiceList';
import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import { userMenu } from '../../@/constants/general';
import WorkThumb from '../../components/WorkThumb';

function Works({ history }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(StateContext);

  const [ t ] = useTranslation('members');
  const [ tc ] = useTranslation('common');

  useEffect(() => {
    Meteor.call('getMyWorks', (error, respond) => {
      if (error) {
        setLoading(false);
        return;
      }
      setWorks(respond);
      setLoading(false);
    });
  }, []);

  if (loading || !works) {
    return <Loader />;
  }

  const myWorksWithActions = works.reverse().map((work) => ({
    ...work,
    actions: [
      {
        content: 'Remove',
        handleClick: () => this.removeWork(work._id),
      },
    ],
  }));

  const pathname = history && history.location.pathname;

  return (
    <Template
      heading={t('works.label')}
      titleCentered
      leftContent={
        <Box p="2">
          <ListMenu pathname={pathname} list={userMenu} />
        </Box>
      }
      rightContent={
        currentUser && (
          <Center p="2">
            <Button
              colorScheme="green"
              variant="outline"
              onClick={() => history.push('/new-work')}
              textTransform="uppercase"
            >
              {tc('actions.create')}
            </Button>
          </Center>
        )
      }
    >
      {currentUser && works ? (
        <NiceList actionsDisabled list={myWorksWithActions}>
          {(work) => (
            <Link
              key={work._id}
              to={`/${work.authorUsername}/work/${work._id}`}
            >
              <WorkThumb work={work} />
            </Link>
          )}
        </NiceList>
      ) : (
        <Alert
          margin="medium"
          message={t('works.message.guest')}
        />
      )}
    </Template>
  );
}

const WorkItem = ({ work }) => (
  <Flex bg="white" p="2" w="100%">
    <Box mr="4">
      <Image
        boxSize="140px"
        h="180px"
        objectFit="cover"
        src={work.images && work.images[0]}
      />
    </Box>
    <Box>
      <Heading as="h3" size="md" mb="2" style={{ overflowWrap: 'anywhere' }}>
        {work.title}
      </Heading>
      <Text fontWeight="light">{work.shortDescription}</Text>
    </Box>
  </Flex>
);

export default Works;
