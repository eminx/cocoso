import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Center, Image, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import Paginate from '../../components/Paginate';
import Loader from '../../components/Loader';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import FiltrerSorter from '../../components/FiltrerSorter';
import Modal from '../../components/Modal';

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
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [modalUser, setModalUser] = useState(null);
  const { currentHost } = useContext(StateContext);

  const getAndSetMembers = async () => {
    try {
      if (currentHost.isPortalHost) {
        setMembers(await call('getAllMembersFromAllHosts'));
      } else {
        setMembers(await call('getHostMembers'));
      }
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

      <Box px="4">
        <FiltrerSorter {...filtrerProps} />
      </Box>

      <Paginate items={membersRendered} itemsPerPage={12}>
        {(member) => (
          <Box key={member.username} p="4" w="80">
            {currentHost.isPortalHost ? (
              <Box cursor="pointer" onClick={() => setModalUser(member)}>
                {member.avatar ? (
                  <Image borderRadius="12px" h="128px" fit="contain" src={member.avatar} />
                ) : (
                  <Avatar
                    borderRadius="12px"
                    name={member.username}
                    showBorder
                    size="2xl"
                    src={member.avatar}
                  />
                )}
                <Box py="2" pl="2">
                  <Text fontWeight="bold" fontSize="lg" isTruncated>
                    {member.username}
                  </Text>
                </Box>
              </Box>
            ) : (
              <Link to={`/@${member.username}`}>
                <Box>
                  {member.avatar ? (
                    <Image borderRadius="12px" h="128px" fit="contain" src={member.avatar} />
                  ) : (
                    <Avatar
                      borderRadius="12px"
                      name={member.username}
                      showBorder
                      size="2xl"
                      src={member.avatar}
                    />
                  )}
                  <Box py="2" pl="2">
                    <Text fontWeight="bold" fontSize="lg" isTruncated>
                      {member.username}
                    </Text>
                  </Box>
                </Box>
              </Link>
            )}
          </Box>
        )}
      </Paginate>

      {modalUser && (
        <Modal
          h="90%"
          isCentered
          isOpen
          scrollBehavior="inside"
          size="lg"
          onClose={() => setModalUser(null)}
        >
          <Center>
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="bold">
                {modalUser.username}
              </Text>
              <Text mb="4">{getFullName(modalUser)}</Text>
              <Center mb="6">
                {modalUser.avatar ? (
                  <Image h="240px" fit="contain" src={modalUser.avatar} />
                ) : (
                  <Avatar
                    borderRadius="0"
                    name={modalUser.username}
                    showBorder
                    size="2xl"
                    src={modalUser.avatar}
                  />
                )}
              </Center>
              {modalUser.bio && (
                <Text textAlign="left" fontSize="sm">
                  {renderHTML(modalUser.bio)}
                </Text>
              )}
            </Box>
          </Center>
        </Modal>
      )}
    </Box>
  );
}

export default MembersPublic;
