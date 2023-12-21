import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Center, Code, Image, Link as CLink, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import FiltrerSorter from '../../components/FiltrerSorter';
import ConfirmModal from '../../components/ConfirmModal';
import InfiniteScroller from '../../components/InfiniteScroller';
import NewGridThumb from '../../components/NewGridThumb';
import { call } from '../../utils/shared';
import PageHeader from '../../components/PageHeader';

function Communities() {
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('name');
  const [modalHost, setModalHost] = useState(null);
  const { allHosts, currentUser, platform, isDesktop } = useContext(StateContext);

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
        return nameA.localeCompare(nameB);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const handleActionButtonClick = () => {
    window.location.href = `https://${modalHost.host}`;
  };

  const filtrerProps = {
    filterWord,
    setFilterWord,
    sorterValue,
    setSorterValue,
  };

  const hostsRendered = getHostsSorted();

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('platform.communities')} | ${platform?.name}`}</title>
      </Helmet>

      <PageHeader
        // description={settings.menu.find((item) => item.name === 'resources')?.description}
        heading={tc('platform.communities')}
        numberOfItems={hostsRendered?.length}
      >
        <FiltrerSorter {...filtrerProps} />
      </PageHeader>

      <Box px={isDesktop ? '4' : '0'}>
        <InfiniteScroller
          canCreateContent={currentUser && currentUser.isSuperAdmin}
          items={hostsRendered}
          newHelperLink="/new-host"
          smallThumb
        >
          {(host) => (
            <Box
              key={host.host}
              cursor="pointer"
              mb="6"
              mx="3"
              onClick={() => handleSetModalHost(host)}
            >
              <NewGridThumb
                fixedImageHeight
                footer={
                  <Box bg="gray.50" p="2">
                    <Text textAlign="center">
                      You are a member <CheckIcon color="green.700" fontSize="sm" ml="2" />
                    </Text>
                  </Box>
                }
                imageUrl={host.logo}
                title={host.name}
              />
            </Box>
          )}
        </InfiniteScroller>
      </Box>

      {modalHost && (
        <ConfirmModal
          confirmText={tc('actions.toHost')}
          isCentered
          scrollBehavior="inside"
          size="lg"
          title={modalHost.name}
          visible
          onConfirm={handleActionButtonClick}
          onCancel={() => setModalHost(null)}
        >
          <Center bg="gray.100" pt="2">
            <Box>
              <Center>
                {modalHost.logo && <Image fit="contain" w="160px" h="80px" src={modalHost.logo} />}
              </Center>
              <Center>
                <Code fontSize="md" fontWeight="bold" linebreak="anywhere" my="2" noOfLines={1}>
                  <CLink as="span" color="brand.500" onClick={handleActionButtonClick}>
                    {modalHost.host}
                  </CLink>
                </Code>
              </Center>
            </Box>
          </Center>
          <Box py="4" maxW="520px">
            {modalHost.info && <div className="text-content">{renderHTML(modalHost?.info)}</div>}
          </Box>
        </ConfirmModal>
      )}
    </Box>
  );
}

export default Communities;
