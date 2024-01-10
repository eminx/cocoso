import React, { useState, useEffect, useContext } from 'react';
import { Box, Center, Container, Flex, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import Loader from '../../components/Loader';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import FiltrerSorter from '../../components/FiltrerSorter';
import Modal from '../../components/Modal';
import HostFiltrer from '../../components/HostFiltrer';
import { useTranslation } from 'react-i18next';
import MemberAvatarEtc from '../../components/MemberAvatarEtc';
import InfiniteScroller from '../../components/InfiniteScroller';
import PageHeader from '../../components/PageHeader';
import Tag from '../../components/Tag';
import { getHslValuesFromLength } from '../../utils/constants/colors';

const compareByDate = (a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB - dateA;
};

function MembersPublic({ history }) {
  const [members, setMembers] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWord, setFilterWord] = useState('');
  const [filterKeyword, setFilterKeyword] = useState(null);
  const [sorterValue, setSorterValue] = useState('random');
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const { allHosts, currentHost, isDesktop } = useContext(StateContext);
  const [t] = useTranslation('members');

  useEffect(() => {
    getAndSetMembers();
  }, []);

  useEffect(() => {
    getKeywords();
  }, [members.length]);

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

  const getKeywords = async () => {
    try {
      const respond = await call('getKeywords');
      const selectedKeywords = respond.filter((k) =>
        members.some((m) => m?.keywords?.map((kw) => kw.keywordId).includes(k._id))
      );
      setKeywords(selectedKeywords);
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

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

  const getButtonLabelForModal = () => {
    const { memberships } = modalUser;
    if (!isPortalHost) {
      return t('actions.visit');
    } else if (hostFilterValue) {
      if (hostFilterValue.host === currentHost?.host) {
        return t('actions.visit');
      } else {
        return t('actions.visithost', { host: getHostNameForModal() });
      }
    } else if (memberships?.some((h) => h?.host === currentHost?.host)) {
      return t('actions.visit');
    } else {
      return t('actions.visithost', { host: getHostNameForModal() });
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

    const membersKeywordFiltered = filterKeyword
      ? membersFiltered.filter((m) =>
          m?.keywords?.map((k) => k.keywordId).includes(filterKeyword._id)
        )
      : membersFiltered;

    return getMembersHostFiltered(membersKeywordFiltered);
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
    } else if (sorterValue === 'random') {
      return membersFiltered.sort(() => 0.5 - Math.random());
    } else {
      return membersFiltered
        .map((m) => ({
          ...m,
          date: m?.memberships?.find((m) => m.host === currentHost?.host)?.date,
        }))
        .sort(compareByDate);
    }
  };

  const filtrerProps = {
    filterWord,
    setFilterWord,
    sorterValue,
    setSorterValue,
  };

  const membersRendered = getMembersFiltered();

  const { settings } = currentHost;
  const coloredKeywords = getColoredKeywords(keywords);

  return (
    <Box mb="8">
      <Helmet>
        <title>{`Members | ${currentHost.settings.name}`}</title>
      </Helmet>

      <PageHeader
        description={settings.menu.find((item) => item.name === 'members')?.description}
        numberOfItems={membersRendered.length}
        showNewButton={false}
      >
        <FiltrerSorter {...filtrerProps}>
          {isPortalHost && (
            <Flex justify={isDesktop ? 'flex-start' : 'center'}>
              <HostFiltrer
                allHosts={allHosts}
                hostFilterValue={hostFilterValue}
                onHostFilterValueChange={(value, meta) => setHostFilterValue(value)}
              />
            </Flex>
          )}
        </FiltrerSorter>
      </PageHeader>

      <Center p="4" pt="0">
        <Wrap>
          <WrapItem>
            <Tag
              label={t('all')}
              checkable
              checked={Boolean(filterKeyword) === false}
              onClick={() => setFilterKeyword(null)}
            />
          </WrapItem>
          {coloredKeywords.map((k) => (
            <WrapItem key={k._id}>
              <Tag
                checkable
                checked={filterKeyword?._id === k?._id}
                filterColor={k.color}
                label={k.label}
                margin={{ bottom: 'small' }}
                onClick={() => setFilterKeyword(k)}
              />
            </WrapItem>
          ))}
        </Wrap>
      </Center>

      <Center mb="2">
        <Text>Sorted randomly</Text>
      </Center>

      <Box pr="3">
        <InfiniteScroller isMasonry centerItems={!isDesktop} items={membersRendered}>
          {(member) => (
            <Flex
              key={member.username}
              bg={member.avatar ? 'white' : 'brand.50'}
              cursor="pointer"
              justifyContent="center"
              mb="4"
              onClick={() => setModalUser(member)}
            >
              <MemberAvatarEtc centerItems hideRole={isPortalHost} isThumb t={t} user={member} />
            </Flex>
          )}
        </InfiniteScroller>
      </Box>

      {modalUser && (
        <Modal
          actionButtonLabel={getButtonLabelForModal()}
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

const getColoredKeywords = (keywords) => {
  const hslValues = getHslValuesFromLength(keywords.length);
  return keywords
    .map((k, i) => ({
      ...k,
      color: hslValues[i],
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export default MembersPublic;
