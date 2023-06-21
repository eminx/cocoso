import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Center, Code, Flex, Image, Link } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import { StateContext } from '../../LayoutContainer';
import GridThumb from '../../components/GridThumb';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import FiltrerSorter from '../../components/FiltrerSorter';
import ConfirmModal from '../../components/ConfirmModal';
import { call } from '../../utils/shared';

function Communities() {
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [modalHost, setModalHost] = useState(null);
  const { allHosts, platform, isDesktop } = useContext(StateContext);

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

      <Box px="4">
        <Flex flexDirection={isDesktop ? 'row' : 'column'}>
          <FiltrerSorter {...filtrerProps} />
        </Flex>
      </Box>

      <Box p="4" pt="8">
        <Paginate centerItems={!isDesktop} items={hostsRendered}>
          {(host) => (
            <Box key={host.host} cursor="pointer" onClick={() => handleSetModalHost(host)}>
              <HostItem host={host} tc={tc} />
            </Box>
          )}
        </Paginate>
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
                  <Link onClick={handleActionButtonClick}>{modalHost.host}</Link>
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

function HostItem({ host, tc }) {
  if (!host) {
    return null;
  }

  return (
    <Box>
      <GridThumb alt={host.name} image={host.logo} imageFit="contain" title={host.name}>
        <Code linebreak="anywhere" mt="4" noOfLines={2} fontSize="xs">
          {host.host}
        </Code>
      </GridThumb>
    </Box>
  );
}

export default Communities;
