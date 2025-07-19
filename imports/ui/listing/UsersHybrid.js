import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import HTMLReactParser from 'html-react-parser';
import Cascader from 'antd/lib/cascader';
import { parse } from 'query-string';

import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  Text,
} from '/imports/ui/core';
import Tabs from '../core/Tabs';

import PageHeading from './PageHeading';
import InfiniteScroller from './InfiniteScroller';
import { Bio } from '../entry/UserHybrid';
import MemberAvatarEtc from '../generic/MemberAvatarEtc';

export default function UsersHybrid({ users, keywords, Host }) {
  const [modalItem, setModalItem] = useState(null);
  const [, setFilterKeyword] = useState(null);
  const [selectedProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { search } = location;
  const { showKeywordSearch } = parse(search, { parseBooleans: true });

  const cascaderOptions =
    keywords &&
    useMemo(
      () => [
        ...keywords.map((kw) => ({
          label: kw.label,
          value: kw._id,
          children: users
            .filter((m) =>
              m?.keywords?.map((k) => k.keywordId)?.includes(kw._id)
            )
            ?.map((mx) => ({
              label: mx.username,
              value: mx.username,
            })),
        })),
        {
          label: <Trans i18nKey="members:all">All</Trans>,
          value: 'allMembers',
          children: users.map((m) => ({
            label: m.username,
            value: m.username,
          })),
        },
      ],
      [users?.length, keywords?.length]
    );

  const usersInMenu = Host?.settings?.menu?.find((item) =>
    ['people', 'members'].includes(item.name)
  );

  const description = usersInMenu?.description;
  const heading = usersInMenu?.label;
  const url = `${Host?.host}/${usersInMenu?.name}`;

  const tabs = [
    {
      path: '/people',
      title: <Trans i18nKey="members:labels.list">List</Trans>,
    },
    {
      path: '/people?showKeywordSearch=true',
      title: <Trans i18nKey="members:labels.search">Search</Trans>,
    },
  ];

  const cascaderRender = (menus) => (
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
          _hover={{ bg: 'theme.50' }}
          borderRadius="lg"
          cursor="pointer"
          maxH="480px"
          mx="2"
          p="2"
          w="310px"
          onClick={() => setModalItem(selectedProfile)}
        >
          <Center>
            <Box>
              <Center>
                <Avatar
                  borderRadius="lg"
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
                <Box
                  pl="2"
                  css={{
                    borderLeft: '4px solid',
                    borderColor: 'var(--cocoso-colors-theme-500)',
                  }}
                >
                  {HTMLReactParser(selectedProfile.bio)}
                </Box>
              )}
            </Box>
          </Center>
        </Box>
      )}
    </div>
  );

  const filterCascaderOptions = (inputValue, path) =>
    path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );

  const handleCascaderSelect = (value) => {
    const username = value[1];
    const selectedItem = users.find((u) => u.username === username);
    if (selectedItem) {
      setModalItem(selectedItem);
    }
  };

  return (
    <>
      <PageHeading
        description={description}
        heading={heading}
        imageUrl={Host?.logo}
        url={url}
      />

      <Center mb="4">
        <Tabs index={showKeywordSearch ? 1 : 0} tabs={tabs} />
      </Center>

      {showKeywordSearch ? (
        <Flex justify="center">
          <Box boxShadow="md">
            <Cascader
              changeOnSelect
              dropdownRender={cascaderRender}
              open
              options={cascaderOptions}
              popupClassName="cascader-container cascader-container--open"
              showSearch={{ filterCascaderOptions }}
              size="large"
              style={{ borderRadius: '8px', width: 240 }}
              onRemove={() => setFilterKeyword('')}
              onChange={handleCascaderSelect}
            />
          </Box>
        </Flex>
      ) : (
        <Box>
          <Center mb="4">
            <Text fontSize="sm">
              <Trans i18nKey="members:message.sortedRandomly">
                Sorted randomly
              </Trans>
            </Text>
          </Center>

          <InfiniteScroller hideFiltrerSorter items={users} itemsPerPage={20}>
            {(user) => (
              <Box
                key={user.username}
                m="4"
                css={{
                  cursor: 'pointer',
                  flexBasis: '240px',
                }}
                onClick={() => setModalItem(user)}
              >
                <MemberAvatarEtc user={user} />
              </Box>
            )}
          </InfiniteScroller>
        </Box>
      )}

      <Modal
        confirmText={<Trans i18nKey="members:actions.visit" />}
        hideHeader
        open={Boolean(modalItem)}
        size="xl"
        onConfirm={() => navigate(`/@${modalItem.username}`)}
        onClose={() => setModalItem(null)}
      >
        <Box pt="8">
          <MemberAvatarEtc isThumb={false} user={modalItem} />
        </Box>
        <Center>
          <Bio user={modalItem} />
        </Center>
      </Modal>
    </>
  );
}
