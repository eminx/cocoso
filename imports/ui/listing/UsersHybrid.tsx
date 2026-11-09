import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Trans } from 'react-i18next';
import { useAtomValue } from 'jotai';
import Select from 'react-select';

import { Box, Center, Modal, Tabs, Text } from '/imports/ui/core';
import { isDesktopAtom, roleAtom } from '/imports/state';
import { Host } from '/imports/ui/types';
import NotFoundPage from '/imports/ui/pages/NotFoundPage';

import { getRenderPass } from './helpers';
import PageHeading from './PageHeading';
import InfiniteScroller from './InfiniteScroller';
import { Bio } from '../entry/UserHybrid';
import MemberAvatarEtc from '../generic/MemberAvatarEtc';

export interface UsersHybridProps {
  Host: Host;
  users: any[];
  keywords?: any[];
}

const LISTING = 'people';

const tabs = [
  {
    path: 'all',
    title: <Trans i18nKey="members:all">All</Trans>,
  },
  {
    title: <Trans i18nKey="members:roles.admin">Admin</Trans>,
    path: 'admin',
  },
  {
    title: <Trans i18nKey="members:roles.contributor">Verified</Trans>,
    path: 'verified',
  },
  {
    title: <Trans i18nKey="members:roles.participant">Non-verified</Trans>,
    path: 'nonverified',
  },
];

const getTabsBasedOnSettings = (Host: Host) => {
  const listingPeopleShow = Host?.settings?.listingPeopleShow;

  if (!listingPeopleShow) {
    return tabs;
  }

  return tabs.filter((tab) => {
    switch (listingPeopleShow) {
      case 'admin':
        return tab.path === 'admin';
      case 'verifiedAdmin':
        return tab.path !== 'nonverified';
      default:
        return true;
    }
  });
};

export default function UsersHybrid({
  Host,
  users,
  keywords,
}: UsersHybridProps) {
  const currentHost = { ...Host };
  const isDesktop = useAtomValue(isDesktopAtom);
  const role = useAtomValue(roleAtom);
  const [modalItem, setModalItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleNavigateUserPage = () => {
    if (
      !Host.isPortalPage ||
      modalItem?.memberships?.find((m) => m.host === Host.host)
    ) {
      navigate(`/@${modalItem.username}`);
      return;
    }
    const membership = modalItem.memberships.find((m) => m.host === Host.host);
    const userHost = membership?.host;
    window.location.href = `https://${userHost}/@${modalItem.username}`;
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setModalItem(null);
    }, 400);
  };

  const keywordsUsed = useMemo(
    () =>
      keywords
        ? keywords.filter((kw) =>
            users?.some((user) =>
              user?.keywords?.some((userKw: any) => userKw.keywordId === kw._id)
            )
          )
        : [],
    [users?.length, keywords?.length]
  );

  const currentTab = searchParams.get('tab') || 'all';

  const filteredUsers = useMemo(() => {
    const usersRoleFiltered = users.filter((user) => {
      switch (currentTab) {
        case 'admin':
          return user.currentRole === 'admin';
        case 'verified':
          return user.currentRole === 'contributor';
        case 'nonverified':
          return user.currentRole === 'participant';
        default:
          return true;
      }
    });

    const selectedKeywordIds = selectedKeywords?.map((kw) => kw?._id);

    if (!selectedKeywordIds || selectedKeywordIds.length === 0) {
      return usersRoleFiltered;
    }

    return usersRoleFiltered?.filter((user) =>
      user.keywords?.some((userKw: any) =>
        selectedKeywordIds.includes(userKw.keywordId)
      )
    );
  }, [users, selectedKeywords, currentTab]);

  const tabs = getTabsBasedOnSettings(Host);

  const renderPass: boolean = getRenderPass(Host, LISTING, role);
  const tabIndex = tabs.findIndex((tab) => tab.path === currentTab);

  if (!renderPass) {
    return <NotFoundPage />;
  }

  return (
    <>
      <PageHeading currentHost={currentHost || Host} listing={LISTING} />

      <Center mb="4">
        <Box p="4" w="100%" css={{ maxWidth: '600px' }}>
          <Select
            closeMenuOnSelect
            isMulti
            options={keywordsUsed}
            placeholder={
              <Trans i18nKey="common:labels.filterKeyword">
                Filter by skills & interests
              </Trans>
            }
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: 'var(--cocoso-border-radius)',
              }),
              multiValue: (base) => ({
                ...base,
                borderRadius: 'var(--cocoso-border-radius)',
              }),
            }}
            value={selectedKeywords}
            getOptionValue={(option: { _id: string }) => option._id}
            onChange={(selectedOptions) => {
              setSelectedKeywords(selectedOptions);
            }}
          />
        </Box>
      </Center>

      <Box>
        <Center mb="4">
          <Tabs index={tabIndex} tabs={tabs} withSearchParams />
        </Center>
        <Center>
          <Text fontSize="sm">
            <Trans i18nKey="members:message.sortedRandomly">
              Sorted randomly
            </Trans>
          </Text>
        </Center>

        <Box style={{ marginTop: isDesktop ? '-4rem' : 0 }}>
          <InfiniteScroller items={filteredUsers} itemsPerPage={20}>
            {(user) => (
              <Box
                key={user.username}
                m="4"
                css={{
                  cursor: 'pointer',
                  flexBasis: '240px',
                }}
                onClick={() => {
                  setModalItem(user);
                  setModalOpen(true);
                }}
              >
                <MemberAvatarEtc user={user} />
              </Box>
            )}
          </InfiniteScroller>
        </Box>
      </Box>

      <Modal
        cancelText={<Trans i18nKey="common:actions.close">Close</Trans>}
        confirmText={
          <Trans i18nKey="members:actions.visit">Visit Profile</Trans>
        }
        hideHeader
        id="users-hybrid"
        open={modalOpen}
        size="xl"
        onConfirm={handleNavigateUserPage}
        onClose={handleCloseModal}
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
