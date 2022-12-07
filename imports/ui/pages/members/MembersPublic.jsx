import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Center, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';

import Paginate from '../../components/Paginate';
import Loader from '../../components/Loader';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import FiltrerSorter from '../../components/FiltrerSorter';

const compareByDate = (a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB - dateA;
};

const getFullName = (member) => {
  const { firstName, lastName } = member;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || '';
};

function MembersPublic() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const { currentHost } = useContext(StateContext);

  const getAndSetMembers = async () => {
    try {
      setMembers(await call('getHostMembers'));
    } catch (error) {
      message.error(error.error);
      console.log(error);
    } finally {
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
  //     message.success(`${user.username} is now set as a cocreator`);
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

  const getMembersSorted = (membersFiltered) => {
    if (sorterValue === 'name') {
      return membersFiltered.sort((a, b) => a.username.localeCompare(b.username));
    }
    return membersFiltered.sort(compareByDate);
  };

  const getMembersFiltered = () => {
    const lowerCaseFilterWord = filterWord?.toLowerCase();
    const membersFiltered = members.filter((member) => {
      if (!member.username) {
        return false;
      }
      return member.username.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
    });

    return getMembersSorted(membersFiltered);
  };

  const filtrerProps = {
    filterWord,
    setFilterWord,
    sorterValue,
    setSorterValue,
  };

  const membersRendered = getMembersFiltered();

  return (
    <Box mb="3">
      <Helmet>
        <title>{`Members | ${currentHost.settings.name}`}</title>
      </Helmet>

      <Center mb="6">
        <FiltrerSorter {...filtrerProps} />
      </Center>

      <Paginate items={membersRendered} itemsPerPage={12}>
        {(member) => (
          <Center p="4" w="60">
            <Link to={`/@${member.username}`}>
              <Box>
                <Avatar name={member.username} showBorder size="2xl" src={member.avatar} />
                <Center>
                  <Text fontWeight="bold" fontSize="lg" isTruncated>
                    {member.username}
                  </Text>
                </Center>
              </Box>
            </Link>
          </Center>
        )}
      </Paginate>
    </Box>
  );
}

export default MembersPublic;
