import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge, Box, Center, Flex, Tag as CTag, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import moment from 'moment';

import { call } from '../../utils/shared';
import { message } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import GridThumb from '../../components/GridThumb';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import FiltrerSorter from '../../components/FiltrerSorter';
import Tabs from '../../components/Tabs';
import HostFiltrer from '../../components/HostFiltrer';

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [combo, setCombo] = useState('all');
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const { allHosts, currentHost } = useContext(StateContext);

  const [t] = useTranslation('resources');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getResources();
  }, []);

  const getResources = async () => {
    try {
      if (currentHost.isPortalHost) {
        setResources(await call('getResourcesFromAllHosts'));
      } else {
        setResources(await call('getResources'));
      }
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const getComboFilteredResources = () => {
    return resources.filter((r) => {
      switch (combo) {
        case 'combo':
          return r.isCombo;
        case 'non-combo':
          return !r.isCombo;
        default:
          return true;
      }
    });
  };

  const getResourcesFiltered = () => {
    const lowerCaseFilterWord = filterWord?.toLowerCase();
    return getComboFilteredResources().filter((resource) => {
      if (!resource.label) {
        return false;
      }
      return (
        resource.label.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        (resource.isCombo &&
          resource.resourcesForCombo.some(
            (r) => r.label.toLowerCase().indexOf(lowerCaseFilterWord) !== -1
          ))
      );
    });
  };

  const getResourcesSorted = () => {
    return getResourcesFiltered().sort((a, b) => {
      if (sorterValue === 'name') {
        return a.label.localeCompare(b.label);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const tabs = [
    {
      title: 'All',
      onClick: () => setCombo('all'),
    },
    {
      title: 'Combo',
      onClick: () => setCombo('combo'),
    },
    {
      title: 'Non combo',
      onClick: () => setCombo('non-combo'),
    },
  ];

  const filtrerProps = {
    filterWord,
    setFilterWord,
    sorterValue,
    setSorterValue,
  };

  const getTabIndex = () => {
    switch (combo) {
      case 'combo':
        return 1;
      case 'non-combo':
        return 2;
      default:
        return 0;
    }
  };

  const getResourcesRenderedHostFiltered = (resourcesRendered) => {
    if (!currentHost.isPortalHost || !hostFilterValue) {
      return resourcesRendered;
    }
    return resourcesRendered.filter((resource) => resource.host === hostFilterValue.host);
  };

  const resourcesRendered = getResourcesSorted();
  const resourcesRenderedHostFiltered = getResourcesRenderedHostFiltered(resourcesRendered);

  const allHostsFiltered = allHosts?.filter((host) => {
    return resourcesRendered.some((resource) => resource.host === host.host);
  });

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('domains.resources')} | ${currentHost.settings.name}`}</title>
      </Helmet>

      <Center mb="2">
        <FiltrerSorter {...filtrerProps}>
          <Tabs mx="4" size="sm" tabs={tabs} index={getTabIndex()} />
        </FiltrerSorter>
      </Center>

      {currentHost.isPortalHost && (
        <Center>
          <HostFiltrer
            allHosts={allHostsFiltered}
            hostFilterValue={hostFilterValue}
            onHostFilterValueChange={(value, meta) => setHostFilterValue(value)}
          />
        </Center>
      )}

      <Paginate items={resourcesRenderedHostFiltered}>
        {(resource) => <ResourceItem key={resource._id} resource={resource} t={t} />}
      </Paginate>
    </Box>
  );
}

function ResourceItem({ resource, t }) {
  const { allHosts, currentHost } = useContext(StateContext);

  if (!resource) {
    return null;
  }

  return (
    <Box>
      <Link to={`/resources/${resource._id}`}>
        <GridThumb alt={resource.label} title={resource.label} image={resource.images?.[0]}>
          <Text lineHeight={1} my="2">
            {resource.isCombo && (
              <Badge>
                {t('cards.isCombo')} ({resource.resourcesForCombo.length})
              </Badge>
            )}{' '}
            <Badge>{resource.isBookable ? t('cards.isBookable') : t('cards.isNotBookable')}</Badge>
          </Text>
          <Text fontSize="xs">{moment(resource.createdAt).format('D MMM YYYY')}</Text>
          {currentHost.isPortalHost && (
            <Flex justify="flex-start">
              <CTag border="1px solid #2d2d2d" mt="2">
                {allHosts.find((h) => h.host === resource.host)?.name}
              </CTag>
            </Flex>
          )}
        </GridThumb>
      </Link>
    </Box>
  );
}

export default Resources;
