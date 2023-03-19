import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Center, Container, Flex, Image, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import Paginate from '../../components/Paginate';
import Loader from '../../components/Loader';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import FiltrerSorter from '../../components/FiltrerSorter';
import Modal from '../../components/Modal';
import HostFiltrer from '../../components/HostFiltrer';

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
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const { allHosts, currentHost, isDesktop } = useContext(StateContext);

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

  const getMembersFiltered = () => {
    const lowerCaseFilterWord = filterWord?.toLowerCase();
    const membersFiltered = members.filter((member) => {
      if (!member.isPublic) {
        return false;
      }
      if (!member.username) {
        return false;
      }
      return member.username.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
    });

    return getMembersHostFiltered(membersFiltered);
  };

  getMembersHostFiltered = (membersFiltered) => {
    if (!currentHost.isPortalHost || !hostFilterValue) {
      return membersFiltered;
    }

    const membersHostFiltered = membersFiltered.filter((member) => {
      return member.memberships.some((membership) => membership.host === hostFilterValue.host);
    });

    return getMembersSorted(membersHostFiltered);
  };

  const getMembersSorted = (membersFiltered) => {
    if (sorterValue === 'name') {
      return membersFiltered.sort((a, b) => a.username.localeCompare(b.username));
    }
    return membersFiltered.sort(compareByDate);
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
        <Flex flexDirection={isDesktop ? 'row' : 'column'}>
          <Box pt="2">
            <FiltrerSorter {...filtrerProps} />
          </Box>

          {currentHost.isPortalHost && (
            <Flex pl={isDesktop ? '8' : '0'} justify={isDesktop ? 'flex-start' : 'center'}>
              <HostFiltrer
                allHosts={allHosts}
                hostFilterValue={hostFilterValue}
                onHostFilterValueChange={(value, meta) => setHostFilterValue(value)}
              />
            </Flex>
          )}
        </Flex>
      </Box>

      <Box px="2">
        <Paginate items={membersRendered} itemsPerPage={12}>
          {(member) => (
            <Box key={member.username} p="4" w="280px">
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
      </Box>

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
              <Center mb="2">
                {modalUser.avatar ? (
                  <Image borderRadius="12px" h="240px" fit="contain" src={modalUser.avatar} />
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
              <Text fontSize="lg" fontWeight="bold">
                {modalUser.username}
              </Text>
              <Text mb="4">{getFullName(modalUser)}</Text>
              {modalUser.bio && <Container textAlign="left">{renderHTML(modalUser.bio)}</Container>}
            </Box>
          </Center>
        </Modal>
      )}
    </Box>
  );
}

export default MembersPublic;
