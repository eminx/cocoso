import React, { useState, useEffect, useContext } from 'react';
import { Box, Center, Container, Flex, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';
import Cascader from 'antd/lib/cascader';

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
import PageHeading from '../../components/PageHeading';
import Tag from '../../components/Tag';
import { getHslValuesFromLength } from '../../utils/constants/colors';

const compareByDate = (a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB - dateA;
};

const onChange = (value) => {
  console.log(value);
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
        const allMembers = await call('getAllMembersFromAllHosts');
        setMembers(allMembers.sort(() => 0.5 - Math.random()));
      } else {
        const allMembers = await call('getHostMembers');
        setMembers(allMembers.sort(() => 0.5 - Math.random()));
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

  const getMembersSorted = (membersFiltered) => {
    if (sorterValue === 'name') {
      return membersFiltered.sort((a, b) => a.username.localeCompare(b.username));
    } else if (sorterValue === 'date') {
      return membersFiltered
        .map((m) => ({
          ...m,
          date: m?.memberships?.find((m) => m.host === currentHost?.host)?.date,
        }))
        .sort(compareByDate);
    } else {
      return membersFiltered;
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

  const filtrerProps = {
    filterWord,
    setFilterWord,
    sorterValue,
    setSorterValue,
  };

  const membersRendered = getMembersFiltered();

  const { settings } = currentHost;
  const title = settings?.menu.find((item) => item.name === 'members')?.label;
  const coloredKeywords = getColoredKeywords(keywords);

  const cascaderOptions = coloredKeywords.map((kw) => ({
    label: kw.label,
    value: kw._id,
    children: members
      .filter((m) => m?.keywords?.map((k) => k.keywordId)?.includes(filterKeyword?._id))
      ?.map((m) => ({
        label: m.username,
        value: m._id,
      })),
  }));

  return (
    <Box mb="8">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <PageHeading
        description={settings.menu.find((item) => item.name === 'members')?.description}
        numberOfItems={membersRendered.length}
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
      </PageHeading>

      <Center pb="4">
        <Cascader options={cascaderOptions} onChange={onChange} placeholder="Please select" />
      </Center>

      {/* <Center p="4" pt="0">
        <Flex justify="center" wrap="wrap">
          <Tag
            checkable
            checked={Boolean(filterKeyword) === false}
            label={t('all')}
            mb="2"
            mr="2"
            onClick={() => setFilterKeyword(null)}
          />
          {coloredKeywords.map((k) => (
            <Tag
              key={k._id}
              checkable
              checked={filterKeyword?._id === k?._id}
              filterColor={k.color}
              label={k.label}
              mb="2"
              mr="2"
              onClick={() => setFilterKeyword(k)}
            />
          ))}
        </Flex>
      </Center> */}

      {sorterValue === 'random' && (
        <Center mb="2">
          <Text>{t('message.sortedRandomly')}</Text>
        </Center>
      )}

      <Box pr="3">
        <InfiniteScroller isMasonry centerItems={!isDesktop} items={membersRendered}>
          {(member) => (
            <Flex
              key={member.username}
              _hover={{ bg: 'brand.50' }}
              border="1px solid"
              borderColor="brand.500"
              cursor="pointer"
              justifyContent="center"
              mb="4"
              onClick={() => setModalUser(member)}
            >
              <Box>
                <MemberAvatarEtc centerItems hideRole={isPortalHost} isThumb t={t} user={member} />
              </Box>
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
