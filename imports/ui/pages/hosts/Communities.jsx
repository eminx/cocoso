import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Center,
  Code,
  Flex,
  Heading as CHeading,
  Image,
  Link as CLink,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import FiltrerSorter from '../../components/FiltrerSorter';
import ConfirmModal from '../../components/ConfirmModal';
import InfiniteScroller from '../../components/InfiniteScroller';
import NewGridThumb from '../../components/NewGridThumb';
import { call } from '../../utils/shared';

function Communities() {
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [modalHost, setModalHost] = useState(null);
  const { allHosts, currentHost, currentUser, platform, isDesktop } = useContext(StateContext);

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

      <Box mb="8" mt="4" px="4">
        <Flex justify="space-between">
          <CHeading color="gray.800" size="lg">
            {tc('platform.communities')}
          </CHeading>
          <FiltrerSorter {...filtrerProps} />
        </Flex>
      </Box>

      <Box px={isDesktop ? '4' : '0'}>
        <InfiniteScroller
          canCreateContent={currentUser && currentUser.isSuperAdmin}
          centerItems
          isMasonry
          items={hostsRendered.filter((h) => h.isPortalHost)}
          newHelperLink="/new-host"
        >
          {(host) => (
            <Box key={host.host} cursor="pointer" onClick={() => handleSetModalHost(host)}>
              <NewGridThumb bg="white" imageUrl={host.logo} tag={host.host} title={host.name} />
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
