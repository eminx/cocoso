import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Center, Container, Divider, Flex, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';
import Cascader from 'antd/lib/cascader';
import { parse } from 'query-string';

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
import Tabs from '../../components/Tabs';
import { ContentLoader } from '../../components/SkeletonLoaders';

const compareByDate = (a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB - dateA;
};

function MembersPublic() {
  const [members, setMembers] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWord, setFilterWord] = useState('');
  const [filterKeyword, setFilterKeyword] = useState(null);
  const [sorterValue, setSorterValue] = useState('random');
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { allHosts, currentHost, isDesktop } = useContext(StateContext);
  const [tm] = useTranslation('members');
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = location;
  const { showKeywordSearch } = parse(search, { parseBooleans: true });

  useEffect(() => {
    getAndSetMembers();
  }, []);

  useEffect(() => {
    getKeywords();
  }, [members?.length]);

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
      setKeywords(selectedKeywords.sort((a, b) => a.label.localeCompare(b.label)));
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  if (loading) {
    return <ContentLoader items={4} />;
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
    const justGo = () => navigate(`/@${username}`);

    if (!isPortalHost) {
      justGo();
    } else if (hostFilterValue) {
      if (hostFilterValue.host === currentHost?.host) {
        justGo();
      } else {
        window.location.href = `https://${currentHost.host}/@${username}`;
      }
    } else if (memberships?.some((h) => h?.host === currentHost?.host)) {
      justGo();
    } else {
      if (memberships?.length === 0) {
        return;
      }
      window.location.href = `https://${memberships[0]?.host}/@${username}`;
    }
  };

  const getButtonLabelForModal = () => {
    const { memberships } = modalUser;
    if (!isPortalHost) {
      return tm('actions.visit');
    } else if (hostFilterValue) {
      if (hostFilterValue.host === currentHost?.host) {
        return tm('actions.visit');
      } else {
        return tm('actions.visithost', { host: getHostNameForModal() });
      }
    } else if (memberships?.some((h) => h?.host === currentHost?.host)) {
      return tm('actions.visit');
    } else {
      return tm('actions.visithost', { host: getHostNameForModal() });
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
      return (
        member.username.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        (member.firstName && member.firstName.toLowerCase().indexOf(lowerCaseFilterWord) !== -1) ||
        (member.lastName && member.lastName.toLowerCase().indexOf(lowerCaseFilterWord) !== -1) ||
        (member.firstName &&
          member.lastName &&
          (member.firstName + ' ' + member.lastName).toLowerCase().indexOf(lowerCaseFilterWord) !==
            -1)
      );
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

  const filterCascaderOptions = (inputValue, path) => {
    return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };

  const handleCascaderSelect = (value, selectedOptions) => {
    const username = value[1];
    if (username) {
      getSelectedProfile(username);
    } else {
      setSelectedProfile(null);
    }
  };

  const getSelectedProfile = async (username) => {
    if (!username) {
      return;
    }
    try {
      const profile = await call('getUserInfo', username);
      isDesktop ? setSelectedProfile(profile) : setModalUser(profile);
    } catch (error) {
      console.log(error);
      message.error(error.error);
    }
  };

  const cascaderRender = (menus) => {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        <div>{menus}</div>
        <Divider orientation="vertical" />
        {selectedProfile && (
          <Box
            _hover={{ bg: 'brand.50' }}
            border="1px solid"
            borderColor="brand.500"
            cursor="pointer"
            maxH="480px"
            mx="2"
            p="2"
            w="310px"
            onClick={() => setModalUser(selectedProfile)}
          >
            <Center>
              <Box>
                <Center>
                  <Avatar
                    borderRadius="0"
                    name={selectedProfile.username}
                    size="2xl"
                    src={selectedProfile.avatar?.src}
                  />
                </Center>
                <Center pt="2">
                  <Button variant="link">
                    <Text textAlign="center" fontSize="xl">
                      {selectedProfile.username}
                    </Text>
                  </Button>
                </Center>

                <Divider my="2" />

                {selectedProfile.bio && (
                  <Box borderLeft="4px solid" borderColor="brand.500" pl="2">
                    {renderHTML(selectedProfile.bio)}
                  </Box>
                )}
              </Box>
            </Center>
          </Box>
        )}
      </div>
    );
  };

  const filtrerProps = {
    filterWord,
    setFilterWord,
    sorterValue,
    setSorterValue,
  };

  const membersRendered = getMembersFiltered();

  const { settings } = currentHost;
  const title = settings?.menu.find((item) => item.name === 'people')?.label;
  const description = settings.menu.find((item) => item.name === 'people')?.description;
  const imageUrl = membersRendered.find((m) => m?.avatar && m.avatar.src)?.avatar.src;

  const cascaderOptions = keywords.map((kw) => ({
    label: kw.label,
    value: kw._id,
    children: members
      .filter((m) => m?.keywords?.map((k) => k.keywordId)?.includes(kw._id))
      ?.map((mx) => ({
        label: mx.username,
        value: mx.username,
      })),
  }));

  const tabs = [
    {
      path: '/people',
      title: tm('labels.list'),
    },
    {
      path: '/people?showKeywordSearch=true',
      title: tm('labels.search'),
    },
  ];

  return (
    <Box mb="8" minHeight="200vh">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description?.substring(0, 150)} />
        <meta property="og:title" content={title?.substring(0, 30)} />
        <meta property="og:description" content={description?.substring(0, 60)} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={currentHost.host} />
      </Helmet>

      <PageHeading description={description} numberOfItems={membersRendered.length}>
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

      <Center>
        <Tabs index={showKeywordSearch ? 1 : 0} mb="4" size="sm" tabs={tabs} />
      </Center>

      {showKeywordSearch ? (
        <Flex justify="space-around">
          <Box flex="1" />
          <Cascader
            changeOnSelect
            dropdownRender={cascaderRender}
            open
            options={cascaderOptions}
            popupClassName="cascader-container cascader-container--open"
            showSearch={{ filterCascaderOptions }}
            size="large"
            style={{ borderRadius: 0, width: 240 }}
            onChange={handleCascaderSelect}
          />
          <Box flex="2" />
        </Flex>
      ) : (
        <Box>
          {sorterValue === 'random' && (
            <Center mb="2">
              <Text>{tm('message.sortedRandomly')}</Text>
            </Center>
          )}

          <Box pr="3">
            <InfiniteScroller isMasonry items={membersRendered}>
              {(member) => (
                <Flex
                  key={member.username}
                  _hover={{ bg: 'brand.50' }}
                  bg="white"
                  border="1px solid"
                  borderColor="brand.500"
                  cursor="pointer"
                  justifyContent="center"
                  mb="4"
                  onClick={() => setModalUser(member)}
                >
                  <Box>
                    <MemberAvatarEtc hideRole={isPortalHost} isThumb user={member} />
                  </Box>
                </Flex>
              )}
            </InfiniteScroller>
          </Box>
        </Box>
      )}

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
          <MemberAvatarEtc hideRole={isPortalHost} user={modalUser} />
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
