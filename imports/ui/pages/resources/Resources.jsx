import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge, Box, Flex, Tag as CTag, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import renderHTML from 'react-render-html';

import { call } from '../../utils/shared';
import { message } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import GridThumb from '../../components/GridThumb';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import FiltrerSorter from '../../components/FiltrerSorter';
import Tabs from '../../components/Tabs';
import HostFiltrer from '../../components/HostFiltrer';
import Modal from '../../components/Modal';
import Tably from '../../components/Tably';
import NewEntryHelper from '../../components/NewEntryHelper';
import { Heading } from '../../components/Header';

function Resources({ history }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [combo, setCombo] = useState('all');
  const [modalResource, setModalResource] = useState(null);
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const { allHosts, currentHost, isDesktop, role } = useContext(StateContext);

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

  const handleActionButtonClick = () => {
    if (modalResource.host === currentHost.host) {
      history.push(`/resources/${modalResource._id}`);
    } else {
      window.location.href = `https://${modalResource.host}/resources/${modalResource._id}`;
    }
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

  const isAdmin = role === 'admin';

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('domains.resources')} | ${currentHost?.settings?.name}`}</title>
      </Helmet>

      <Box px="4" my="4">
        <Flex justify="space-between">
          <Heading />
          <FiltrerSorter {...filtrerProps}>
            {currentHost.isPortalHost && (
              <Flex justify={isDesktop ? 'flex-start' : 'center'} pl={isDesktop ? '8' : '0'}>
                <HostFiltrer
                  allHosts={allHostsFiltered}
                  hostFilterValue={hostFilterValue}
                  onHostFilterValueChange={(value, meta) => setHostFilterValue(value)}
                />
              </Flex>
            )}
            <Tabs mx="4" size="sm" tabs={tabs} index={getTabIndex()} />
          </FiltrerSorter>
        </Flex>
      </Box>

      <Box px="4">
        <Paginate centerItems={!isDesktop} items={resourcesRenderedHostFiltered}>
          {(resource) => (
            <Box key={resource._id}>
              {currentHost.isPortalHost ? (
                <Box cursor="pointer" onClick={() => setModalResource(resource)}>
                  <ResourceItem resource={resource} t={t} />
                </Box>
              ) : (
                <Link to={`/resources/${resource._id}`}>
                  <ResourceItem resource={resource} t={t} />
                </Link>
              )}{' '}
            </Box>
          )}
        </Paginate>
      </Box>

      {modalResource && (
        <Modal
          h="90%"
          isCentered
          isOpen
          scrollBehavior="inside"
          size="6xl"
          onClose={() => setModalResource(null)}
          actionButtonLabel={tc('actions.toThePage', {
            hostName: allHosts.find((h) => h.host === modalResource.host)?.name,
          })}
          onActionButtonClick={() => handleActionButtonClick()}
        >
          <Tably
            content={modalResource.description && renderHTML(modalResource.description)}
            images={modalResource.images}
            tags={[allHosts.find((h) => h.host === modalResource.host)?.name]}
            title={modalResource.label}
          />
        </Modal>
      )}

      {isAdmin && <NewEntryHelper buttonLink="/resources/new" />}
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
      <GridThumb alt={resource.label} title={resource.label} image={resource.images?.[0]}>
        <Text lineHeight={1} my="2">
          {resource.isCombo && (
            <Badge>
              {t('cards.isCombo')} ({resource.resourcesForCombo?.length})
            </Badge>
          )}{' '}
          <Badge>{!resource.isBookable && t('cards.isNotBookable')}</Badge>
        </Text>
        {/* <Text fontSize="xs">{moment(resource.createdAt).format('D MMM YYYY')}</Text> */}
        {currentHost.isPortalHost && (
          <Flex justify="flex-start">
            <CTag border="1px solid #2d2d2d" mt="2">
              {allHosts.find((h) => h.host === resource.host)?.name}
            </CTag>
          </Flex>
        )}
      </GridThumb>
    </Box>
  );
}

export default Resources;
