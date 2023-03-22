import React, { useState, useEffect, useContext } from 'react';
import { Box, Center, Container, Flex } from '@chakra-ui/react';
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
import { useTranslation } from 'react-i18next';
import MemberAvatarEtc from '../../components/MemberAvatarEtc';

const compareByDate = (a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB - dateA;
};

function MembersPublic({ history }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const { allHosts, currentHost, isDesktop } = useContext(StateContext);
  const [t] = useTranslation('members');

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

  const { isPortalHost } = currentHost;

  const getHostNameForModal = () => {
    if (hostFilterValue) {
      return hostFilterValue.name;
    }
    const firstHost = modalUser?.memberships[0]?.host;
    return allHosts.find((h) => h.host === firstHost)?.name;
  };

  const handleVisitUserProfile = () => {
    const { memberships, username } = modalUser;
    const justGo = () => history.push(`/@${username}`);

    if (!isPortalHost) {
      justGo();
    } else if (hostFilterValue) {
      if (hostFilterValue.host === currentHost?.host) {
        justGo();
      } else {
        window.location.href = `https://${hostFilterValue.host}/@${username}`;
      }
    } else if (memberships?.some((h) => h?.host === currentHost?.host)) {
      justGo();
    } else {
      window.location.href = `https://${memberships[0]?.host}/@${username}`;
    }
  };

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

  const getMembersHostFiltered = (membersFiltered) => {
    if (!isPortalHost || !hostFilterValue) {
      return getMembersSorted(membersFiltered);
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
    return membersFiltered
      .map((m) => ({
        ...m,
        date: m?.memberships?.find((m) => m.host === currentHost?.host)?.date,
      }))
      .sort(compareByDate);
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

      <Box px="4" mb="4">
        <Flex flexDirection={isDesktop ? 'row' : 'column'}>
          <Box pt="2">
            <FiltrerSorter {...filtrerProps} />
          </Box>

          {isPortalHost && (
            <Flex justify={isDesktop ? 'flex-start' : 'center'} pl={isDesktop ? '8' : '0'} py="2">
              <HostFiltrer
                allHosts={allHosts}
                hostFilterValue={hostFilterValue}
                onHostFilterValueChange={(value, meta) => setHostFilterValue(value)}
              />
            </Flex>
          )}
        </Flex>
      </Box>

      <Box mt="2">
        <Paginate centerItems={!isDesktop} items={membersRendered} itemsPerPage={12}>
          {(member) => (
            <Flex
              key={member.username}
              justifyContent={isDesktop ? 'flex-start' : 'center'}
              py="2"
              px="1"
              w={isDesktop ? '280px' : '2xs'}
              cursor="pointer"
              onClick={() => setModalUser(member)}
            >
              <MemberAvatarEtc
                centerItems={!isDesktop}
                hideRole={isPortalHost}
                isThumb
                t={t}
                user={member}
              />
            </Flex>
          )}
        </Paginate>
      </Box>

      {modalUser && (
        <Modal
          actionButtonLabel={
            isPortalHost
              ? t('actions.visithost', { host: getHostNameForModal() })
              : t('actions.visit')
          }
          h="90%"
          isCentered
          isOpen
          scrollBehavior="inside"
          size="lg"
          onClose={() => setModalUser(null)}
          onActionButtonClick={handleVisitUserProfile}
        >
          <MemberAvatarEtc centerItems hideRole={isPortalHost} t={t} user={modalUser} />
          <Center mt="2">
            <Box textAlign="center">
              {modalUser.bio && <Container textAlign="left">{renderHTML(modalUser.bio)}</Container>}
            </Box>
          </Center>
        </Modal>
      )}
    </Box>
  );
}

export default MembersPublic;
