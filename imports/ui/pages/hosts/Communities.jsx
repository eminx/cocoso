import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex, Image, Tag as CTag, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import moment from 'moment';

import { StateContext } from '../../LayoutContainer';
import GridThumb from '../../components/GridThumb';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import FiltrerSorter from '../../components/FiltrerSorter';
import ConfirmModal from '../../components/ConfirmModal';

function Communities() {
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [modalHost, setModalHost] = useState(null);
  const { allHosts, platform, isDesktop } = useContext(StateContext);

  const [tc] = useTranslation('common');

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

      <Box p="4">
        <Paginate items={hostsRendered}>
          {(host) => (
            <Box key={host.host} cursor="pointer" onClick={() => setModalHost(host)}>
              <HostItem host={host} tc={tc} />
            </Box>
          )}
        </Paginate>
      </Box>

      {modalHost && (
        <ConfirmModal
          confirmText={tc('actions.toHost', { host: modalHost.name })}
          isCentered
          scrollBehavior="inside"
          size="sm"
          title={modalHost.name}
          visible
          onConfirm={handleActionButtonClick}
          onCancel={() => setModalHost(null)}
        >
          <Center>
            {modalHost.logo && <Image fit="contain" w="160px" h="80px" src={modalHost.logo} />}
          </Center>
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
        <Text fontSize="xs">{moment(host.createdAt).format('D MMM YYYY')}</Text>

        <CTag border="1px solid #2d2d2d" mt="4">
          {host.host}
        </CTag>
        <Text my="4">{tc('platform.membersCount', { membersCount: host.membersCount })}</Text>
      </GridThumb>
    </Box>
  );
}

export default Communities;
