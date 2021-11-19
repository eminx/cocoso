import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Center, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import Loader from '../../UIComponents/Loader';
import { message } from '../../UIComponents/message';
import { call } from '../../functions';
import { StateContext } from '../../LayoutContainer';

const compareByDate = (a, b) => {
  const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);
  return dateB - dateA;
};

const getFullName = (member) => {
  const { firstName, lastName } = member;
  if (firstName && lastName) {
    return firstName + ' ' + lastName;
  } else {
    return firstName || lastName || '';
  }
};

const publicSettings = Meteor.settings.public;

function PublicMembers({ history }) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const { currentHost } = useContext(StateContext);

  const getAndSetMembers = async () => {
    setLoading(true);
    try {
      const members = await call('getHostMembers');
      const sortedMembers = members.sort(compareByDate);
      setMembers(sortedMembers);
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

  // const setAsParticipant = async (user) => {
  //   try {
  //     await call('setAsParticipant', user.id);
  //     message.success(`${user.username} is now set back as a participant`);
  //     getAndSetMembers();
  //   } catch (error) {
  //     console.log(error);
  //     message.error(error.reason || error.error);
  //   }
  // };

  // const setAsContributor = async (user) => {
  //   try {
  //     await call('setAsContributor', user.id);
  //     message.success(`${user.username} is now set as a contributor`);
  //     getAndSetMembers();
  //   } catch (error) {
  //     console.log(error);
  //     message.error(error.reason || error.error);
  //   }
  // };

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
    <Box mb="3" p="1">
      <Helmet>
        <title>{`Members | ${currentHost.settings.name} | ${publicSettings.name}`}</title>
      </Helmet>
      <Center>
        <Wrap>
          {members.map((member) => (
            <WrapItem key={member.id}>
              <Link to={`/@${member.username}`}>
                <Box m="1">
                  <Avatar
                    name={member.username}
                    src={member.avatarSrc}
                    size="2xl"
                  />
                  <Center>
                    <Text fontWeight="bold" fontSize="lg" isTruncated>
                      {member.username}
                    </Text>
                  </Center>
                  <Center>
                    <Text isTruncated>{getFullName(member)}</Text>
                  </Center>
                </Box>
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      </Center>
    </Box>
  );
}

export default PublicMembers;
