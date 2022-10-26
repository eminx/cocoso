import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge, Box, Center, Heading, Text } from '@chakra-ui/react';
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

function Resources() {
  const { currentHost } = useContext(StateContext);
  const [resources, setResources] = useState([]);
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [isLoading, setIsLoading] = useState(true);
  const [combo, setCombo] = useState('all');

  const [t] = useTranslation('resources');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getResources();
  }, []);

  const getResources = async () => {
    try {
      const response = await call('getResources');
      setResources(response);
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
    return getComboFilteredResources().filter((resource) => {
      const lowerCaseFilterWord = filterWord?.toLowerCase();
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

  const resourcesRendered = getResourcesSorted();

  if (resourcesRendered.length === 0) {
    return (
      <Center>
        <Heading size="md" fontWeight="bold">
          {t('messages.notfound')}
        </Heading>
      </Center>
    );
  }

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('domains.resources')} | ${currentHost.settings.name}}`}</title>
      </Helmet>

      <Center mb="2">
        <FiltrerSorter {...filtrerProps}>
          <Tabs mx="4" size="sm" tabs={tabs} index={getTabIndex()} />
        </FiltrerSorter>
      </Center>

      <Paginate items={resourcesRendered}>
        {(resource) => <ResourceItem key={resource._id} resource={resource} t={t} />}
      </Paginate>
    </Box>
  );
}

function ResourceItem({ t, resource }) {
  if (!resource) {
    return null;
  }

  return (
    <Box>
      <Link to={`/resources/${resource._id}`}>
        <GridThumb alt={resource.label} title={resource.label} image={resource.images?.[0]}>
          {resource.isCombo && (
            <Badge>
              {t('cards.ifCombo')} ({resource.resourcesForCombo.length})
            </Badge>
          )}
          <Text fontSize="xs">{moment(resource.createdAt).format('D MMM YYYY')}</Text>
        </GridThumb>
      </Link>
    </Box>
  );
}

export default Resources;
