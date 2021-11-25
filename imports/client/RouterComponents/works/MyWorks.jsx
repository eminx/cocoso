import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
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
import NiceList from '../../UIComponents/NiceList';
import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import Loader from '../../UIComponents/Loader';
import { message, Alert } from '../../UIComponents/message';
import { userMenu } from '../../constants/general';

function Works({ history }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(StateContext);

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
      heading="My Works"
      titleCentered
      leftContent={
        <Box p="4">
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
            >
              NEW
            </Button>
          </Center>
        )
      }
    >
      {currentUser && works ? (
        <NiceList list={myWorksWithActions} actionsDisabled>
          {(work) => <WorkItem work={work} history={history} />}
        </NiceList>
      ) : (
        <Alert
          margin="medium"
          message="You have to create an account to launch your market"
        />
      )}
    </Template>
  );
}

const WorkItem = ({ work, history }) => (
  <Link to={`/${work.authorUsername}/work/${work._id}`}>
    <Flex w="100%" p="2" bg="white">
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
  </Link>
);

export default Works;
