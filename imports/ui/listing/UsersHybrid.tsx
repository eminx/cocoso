import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Trans } from 'react-i18next';
import { useAtomValue } from 'jotai';
import Select from 'react-select';

import { Box, Center, Modal, Text } from '/imports/ui/core';
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
            users.some((user) =>
              user.keywords?.some((userKw: any) => userKw.keywordId === kw._id)
            )
          )
        : [],
    [users?.length, keywords?.length]
  );

  const filteredUsers = useMemo(() => {
    if (selectedKeywords.length === 0) {
      return users;
    }
    const selectedKeywordIds = selectedKeywords.map((kw) => kw._id);
    return users.filter((user) =>
      user.keywords?.some((userKw: any) =>
        selectedKeywordIds.includes(userKw.keywordId)
      )
    );
  }, [users, selectedKeywords]);

  const renderPass: boolean = getRenderPass(Host, LISTING, role);

  if (!renderPass) {
    return <NotFoundPage />;
  }

  return (
    <>
      <PageHeading currentHost={currentHost || Host} listing={LISTING} />

      <Center mb="4">
        <Box w="100%" maxW="600px" p="4">
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
