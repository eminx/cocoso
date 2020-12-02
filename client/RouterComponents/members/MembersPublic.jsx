import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Box, Text } from 'grommet';
import { Avatar } from '@chakra-ui/react';

import Loader from '../../UIComponents/Loader';
import { GridList } from '../../UIComponents/NiceList';
import { message } from '../../UIComponents/message';
import { StateContext } from '../../LayoutContainer';
import { call } from '../../functions';

const getFullName = (member) => {
  const { firstName, lastName } = member;
  if (firstName && lastName) {
    return firstName + ' ' + lastName;
  } else {
    return firstName || lastName || '';
  }
};

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
      gap={{ bottom: 'medium', horizontal: 'small' }}
    >
      {/* <GridList
        actionsDisabled={!currentUser || role === 'participant'}
        list={membersList}
        border="horizontal"
        pad="small"
      >*/}
      {members.map((member) => (
        <Link to={`/@${member.username}`} key={member.id}>
          <Box
            align="center"
            margin="small"
            style={{ width: 128, wordBreak: 'break-all', textAlign: 'center' }}
          >
            <Avatar name={member.username} src={member.avatarSrc} size="xl" />
            <Anchor>
              <Text size="small">{member.username}</Text>
            </Anchor>
            <Text size="small">{getFullName(member)}</Text>
          </Box>
        </Link>
      ))}
      {/* </GridList> */}
    </Box>
  );
}

export default PublicMembers;
