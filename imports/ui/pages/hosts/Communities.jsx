import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Center, Code, Image, Link as CLink, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { Helmet } from 'react-helmet';
import parseHtml from 'html-react-parser';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import FiltrerSorter from '../../components/FiltrerSorter';
import ConfirmModal from '../../components/ConfirmModal';
import InfiniteScroller from '../../components/InfiniteScroller';
import NewGridThumb from '../../components/NewGridThumb';
import { call } from '../../utils/shared';
import PageHeading from '../../components/PageHeading';
import { message } from '../../components/message';

function Communities() {
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('name');
  const [modalHost, setModalHost] = useState(null);
  const { allHosts, currentUser, platform, isDesktop } = useContext(StateContext);
  const navigate = useNavigate();

  const [tc] = useTranslation('common');

  const handleSetModalHost = async (host) => {
    try {
      const info = await call('getHostInfoPage', host.host);
      setModalHost({ ...host, info });
    } catch (error) {
      console.log(error);
    }
  };

  if (!allHosts) {
    return <Loader />;
  }

  if (!allHosts) {
    return <Loader />;
  }

  const getHostsFiltered = () => {
    const lowerCaseFilterWord = filterWord?.toLowerCase();
    if (!allHosts || allHosts.length === 0) {
      return null;
    }
    return allHosts.filter((host) => {
      if (!host) {
        return false;
      }
      const name = host.name?.toLowerCase();
      const city = host.city?.toLowerCase();

      return name.indexOf(lowerCaseFilterWord) !== -1 || city.indexOf(lowerCaseFilterWord) !== -1;
    });
  };

  const getHostsSorted = () => {
    const filteredHosts = getHostsFiltered();
    if (!filteredHosts || filteredHosts.length === 0) {
      return [];
    }
    return filteredHosts.sort((a, b) => {
      if (sorterValue === 'name') {
        const nameA = a?.name;
        const nameB = b?.name;
        return nameA?.localeCompare(nameB);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const getHostsDivided = (hostsSorted) => {
    if (!currentUser) {
      return hostsSorted;
    }

    const myHosts = currentUser.memberships;
    const myHostsSorted = myHosts.sort((a, b) => {
      if (sorterValue === 'name') {
        const nameA = a?.hostname;
        const nameB = b?.hostname;
        return nameA?.localeCompare(nameB);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return [
      ...myHostsSorted.map((mh) => ({
        ...mh,
        logo: hostsSorted.find((h) => mh.host === h.host)?.logo,
        isMember: true,
      })),
      ...hostsSorted.filter((h) => !myHosts.some((mh) => h.host === mh.host)),
    ];
  };

  const joinCommunity = async () => {
    if (!currentUser) {
      navigate('/register');
      return;
    }

    const host = modalHost.host;

    try {
      await call('setSelfAsParticipant', host);
      message.success(tc('communities.success', { community: modalHost.name }));
      setModalHost(null);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  const handleActionButtonClick = () => {
    window.location.href = `https://${modalHost.host}`;
  };

  const hostsSorted = getHostsSorted();
  const hostsRendered = getHostsDivided(hostsSorted).filter((h) => h.host !== platform.portalHost);

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('platform.communities')} | ${platform?.name}`}</title>
      </Helmet>

      <PageHeading heading={tc('platform.communities')} numberOfItems={hostsRendered?.length}>
        {/* <FiltrerSorter {...filtrerProps} /> */}
      </PageHeading>

      <Box px={isDesktop ? '4' : '0'}>
        <InfiniteScroller
          canCreateContent={currentUser && currentUser.isSuperAdmin}
          items={hostsRendered}
          newHelperLink="/new-host"
          smallThumb
        >
          {(host) => (
            <Box key={host.host} alignSelf="center" m="2" width={300}>
              <Box onClick={() => handleSetModalHost(host)}>
                <NewGridThumb
                  coverText={host.host}
                  fixedImageHeight
                  imageUrl={host.logo}
                  title={host.name || host.hostname}
                />
              </Box>

              <Box bg="brand.500" p="2">
                {host.isMember ? (
                  <Text color="white" textAlign="center" my="1">
                    {tc('communities.member')} <CheckIcon color="green.100" fontSize="md" mt="-1" />
                  </Text>
                ) : (
                  <Center>
                    <Button
                      bg="white"
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetModalHost(host)}
                    >
                      {tc('communities.join')}
                    </Button>
                  </Center>
                )}
              </Box>
            </Box>
          )}
        </InfiniteScroller>
      </Box>

      {modalHost && (
        <ConfirmModal
          confirmText={modalHost.isMember ? tc('actions.toHost') : tc('communities.join')}
          isCentered
          scrollBehavior="inside"
          size="lg"
          title={modalHost.name}
          visible
          onConfirm={modalHost.isMember ? handleActionButtonClick : joinCommunity}
          onCancel={() => setModalHost(null)}
        >
          <Center bg="gray.100" pt="2">
            <Box>
              <Center>
                <Text fontSize="sm">{tc('actions.toHost')}:</Text>
              </Center>
              <Center>
                {modalHost.logo && <Image fit="contain" w="160px" h="80px" src={modalHost.logo} />}
              </Center>
              <Center>
                <Code fontSize="md" fontWeight="bold" linebreak="anywhere" my="2" noOfLines={1}>
                  <CLink as="span" color="blue.600" onClick={handleActionButtonClick}>
                    {modalHost.host}
                  </CLink>
                </Code>
              </Center>
            </Box>
          </Center>

          <Box bg="white" maxW="520px" p="4">
            <Text fontSize="sm" fontWeight="bold" textAlign="center">
              {tc('communities.info', { community: modalHost.name })}
            </Text>
          </Box>

          <Box py="4" maxW="520px">
            {modalHost.info && <div className="text-content">{parseHtml(modalHost?.info)}</div>}
          </Box>
        </ConfirmModal>
      )}
    </Box>
  );
}

export default Communities;
