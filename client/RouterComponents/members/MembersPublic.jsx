import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Box, Text } from 'grommet';
import { Avatar } from '@chakra-ui/react';

import Loader from '../../UIComponents/Loader';
import { GridList } from '../../UIComponents/NiceList';
import { message } from '../../UIComponents/message';
import { StateContext } from '../../LayoutContainer';
import { call } from '../../functions';

function PublicMembers({ history }) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  const { currentUser, role } = useContext(StateContext);

  const getAndSetMembers = async () => {
    setLoading(true);
    try {
      const members = await call('getHostMembers');
      setMembers(members);
      setLoading(false);
    } catch (error) {
      message.error(error.error);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAndSetMembers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const setAsParticipant = async (user) => {
    try {
      await call('setAsParticipant', user.id);
      message.success(`${user.username} is now set back as a participant`);
      getAndSetMembers();
    } catch (error) {
      console.log(error);
      message.error(error.reason || error.error);
    }
  };

  const setAsContributor = async (user) => {
    try {
      await call('setAsContributor', user.id);
      message.success(`${user.username} is now set as a contributor`);
      getAndSetMembers();
    } catch (error) {
      console.log(error);
      message.error(error.reason || error.error);
    }
  };

  // const membersList = members.map((member) => ({
  //   ...member,
  //   actions: [
  //     {
  //       content: 'Set as a Contributor',
  //       handleClick: () => setAsContributor(member),
  //       isDisabled:
  //         ['admin', 'contributor'].includes(member.role) ||
  //         !['admin', 'contributor'].includes(role),
  //     },
  //     {
  //       content: 'Revert back as a Participant',
  //       handleClick: () => setAsParticipant(member),
  //       isDisabled:
  //         !['contributor'].includes(member.role) || !['admin'].includes(role),
  //     },
  //   ],
  // }));

  return (
    <Box
      pad="small"
      margin={{ bottom: 'large' }}
      alignSelf="center"
      style={{ maxWidth: 960 }}
      direction="row"
      wrap
      gap="medium"
    >
      {/* <GridList
        actionsDisabled={!currentUser || role === 'participant'}
        list={membersList}
        border="horizontal"
        pad="small"
      >*/}
      {members.map((member) => (
        <Link to={`/@${member.username}`} key={member.id}>
          <Box align="center" margin="small">
            <Avatar name={member.username} src={member.avatarSrc} size="xl" />
            <Anchor as="div">
              <Text>{member.username}</Text>
            </Anchor>
            <Text size="small">{member.role}</Text>
          </Box>
        </Link>
      ))}
      {/* </GridList> */}
    </Box>
  );
}

export default PublicMembers;
