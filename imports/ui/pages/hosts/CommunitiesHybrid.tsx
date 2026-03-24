import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import HTMLReactParser from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { Trans, useTranslation } from 'react-i18next';
import CheckIcon from 'lucide-react/dist/esm/icons/check';
import { useAtomValue } from 'jotai';

import {
  Box,
  Button,
  Center,
  Code,
  Divider,
  Heading,
  Image,
  Link as CLink,
  Modal,
  Text,
} from '/imports/ui/core';
import { currentUserAtom } from '/imports/state';
import InfiniteScroller from '/imports/ui/listing/InfiniteScroller';
import NewGridThumb from '/imports/ui/listing/NewGridThumb';
import { message } from '/imports/ui/generic/message';
import { call } from '/imports/api/_utils/shared';

export default function CommunitiesHybrid({ Host, hosts }) {
  const [modalItem, setModalItem] = useState(null);
  const [tc] = useTranslation('common');
  const navigate = useNavigate();
  const currentUser = useAtomValue(currentUserAtom);

  const sortValue = 'name';

  const handleSetModalHost = async (host: any) => {
    try {
      const info = await call('getHostInfoPage', host.host);
      setModalItem({ ...host, info });
    } catch (error) {
      console.log(error);
    }
  };

  const getHostsSorted = () => {
    if (!hosts || hosts.length === 0) {
      return [];
    }
    return hosts?.sort((a, b) => {
      if (sortValue === 'name') {
        const nameA = a?.name;
        const nameB = b?.name;
        return nameA?.localeCompare(nameB);
      }
      return new Date(b?.createdAt) - new Date(a?.createdAt);
    });
  };

  const getHostsDivided = (hostsSorted: any) => {
    if (!currentUser) {
      return hostsSorted;
    }

    const myHosts = currentUser?.memberships;
    const myHostsSorted = myHosts?.sort((a, b) => {
      if (sortValue === 'name') {
        const nameA = a?.hostname;
        const nameB = b?.hostname;
        return nameA?.localeCompare(nameB);
      }
      return new Date(b?.createdAt) - new Date(a?.createdAt);
    });

    const myHostsParsed = myHostsSorted
      ? myHostsSorted.map((mh) => ({
          ...mh,
          logo: hostsSorted.find((h) => mh.host === h.host)?.logo,
          isMember: true,
        }))
      : [];

    return [
      ...myHostsParsed,
      ...hostsSorted.filter((h) => !myHosts?.some((mh) => h.host === mh.host)),
    ];
  };

  const joinCommunity = async () => {
    if (!currentUser) {
      navigate('/register');
      return;
    }

    const host = modalItem?.host;

    try {
      await call('setSelfAsParticipant', host);
      message.success(tc('communities.success', { community: modalItem.name }));
      setModalItem(null);
    } catch (error: any) {
      message.error(error.reason || error.error);
    }
  };

  const handleActionButtonClick = () => {
    window.location.href = `https://${modalItem.host}`;
  };

  const hostsSorted = getHostsSorted();
  const hostsRendered = getHostsDivided(hostsSorted)?.filter(
    (h) => h.host !== Host.host
  );

  return (
    <>
      <Heading as="h1" size="lg" textAlign="center">
        <Trans i18nKey="common:platform.communities">Communities</Trans>
      </Heading>
      <Center py="2">
        <Divider
          css={{
            borderColor: 'var(--cocoso-colors-theme-500)',
            width: '280px',
          }}
        />
      </Center>

      <Box px="2" mt="4">
        <InfiniteScroller hideFiltrerSorter items={hostsRendered}>
          {(host) => (
            <Box key={host.host} m="2" w="300px">
              <Box onClick={() => handleSetModalHost(host)}>
                <NewGridThumb
                  coverText={host.host}
                  fixedImageHeight
                  imageUrl={host.logo}
                  title={host.name || host.hostname}
                />
              </Box>

              <Box p="2">
                {host.isMember ? (
                  <Center>
                    <Text textAlign="center" my="1">
                      <Trans i18nKey="common:communities.member" />
                      <CheckIcon color="green.100" fontSize="md" mt="-1" />
                    </Text>
                  </Center>
                ) : (
                  <Center>
                    <Button
                      bg="white"
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetModalHost(host)}
                    >
                      <Trans i18nKey="common:communities.join">Join</Trans>
                    </Button>
                  </Center>
                )}
              </Box>
            </Box>

            // <Box
            //   key={host._id}
            //   borderRadius="lg"
            //   cursor="pointer"
            //   mb="2"
            //   onClick={() => setModalItem(host)}
            // >
            //   <NewGridThumb
            //     fixedImageHeight
            //     host={Host?.isPortalHost ? host.host : null}
            //     imageUrl={host.images?.[0]}
            //     title={host.label}
            //   />
            // </Box>
          )}
        </InfiniteScroller>

        {modalItem && (
          <Modal
            confirmText={
              modalItem.isMember ? (
                <Trans i18nKey="common:actions.toHost">Visit</Trans>
              ) : (
                <Trans i18nKey="common:communities.join">Join</Trans>
              )
            }
            id="communities-hybrid"
            size="lg"
            title={modalItem.hostname}
            open={Boolean(modalItem)}
            onConfirm={
              modalItem.isMember ? handleActionButtonClick : joinCommunity
            }
            onClose={() => setModalItem(null)}
          >
            <Center bg="gray.100" p="2">
              <Box>
                <Center>
                  <Text>
                    <Trans i18nKey="common:actions.toHost">Visit</Trans>:
                  </Text>
                  <Code
                    css={{
                      linebreak: 'anywhere',
                      marginBottom: '-3px',
                      noOfLines: '1',
                    }}
                  >
                    <CLink color="blue.600" onClick={handleActionButtonClick}>
                      {modalItem.host}
                    </CLink>
                  </Code>
                </Center>
                {modalItem.logo && (
                  <Center p="2">
                    <Image fit="contain" width="160px" src={modalItem.logo} />
                  </Center>
                )}
              </Box>
            </Center>

            <Box bg="white" p="4" css={{ maxWidth: '520px' }}>
              <Text fontSize="sm" fontWeight="bold" textAlign="center">
                <Trans
                  i18nKey="common:communities.info"
                  values={{ community: modalItem.name }}
                >
                  INFO
                </Trans>
              </Text>
            </Box>

            <Box py="4" css={{ maxWidth: '520px' }}>
              {modalItem.info && (
                <div className="text-content">
                  {HTMLReactParser(DOMPurify.sanitize(modalItem.info))}
                </div>
              )}
            </Box>
          </Modal>
        )}
      </Box>
    </>
  );
}
