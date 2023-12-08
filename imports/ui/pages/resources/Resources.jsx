import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Box, Flex, Tag as CTag, Text } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import { call } from '../../utils/shared';
import { message } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import GridThumb from '../../components/GridThumb';
import Loader from '../../components/Loader';
import FiltrerSorter from '../../components/FiltrerSorter';
import Tabs from '../../components/Tabs';
import HostFiltrer from '../../components/HostFiltrer';
import Modal from '../../components/Modal';
import Tably from '../../components/Tably';
import InfiniteScroller from '../../components/InfiniteScroller';

import { Heading } from '../../components/Header';
import NewGridThumb from '../../components/NewGridThumb';

function Resources({ history }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('name');
  const [combo, setCombo] = useState('all');
  const [modalResource, setModalResource] = useState(null);
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const [isCopied, setCopied] = useState(false);
  const { allHosts, currentHost, isDesktop, role } = useContext(StateContext);

  const [t] = useTranslation('resources');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getResources();
  }, []);

  const isPortalHost = currentHost?.isPortalHost;

  const getResources = async () => {
    try {
      if (isPortalHost) {
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

  const getResourcesHostFiltered = (items) => {
    if (!isPortalHost || !hostFilterValue) {
      return items;
    }
    return items.filter((resource) => resource.host === hostFilterValue.host);
  };

  const resourcesRendered = useMemo(() => {
    const resourcesSorted = getResourcesSorted();
    const resourcesHostFiltered = getResourcesHostFiltered(resourcesSorted);
    return resourcesHostFiltered;
  }, [combo, filterWord, hostFilterValue, resources, sorterValue]);

  const allHostsFiltered = allHosts?.filter((host) => {
    return resourcesRendered.some((resource) => resource.host === host.host);
  });

  if (loading) {
    return <Loader />;
  }

  const handleActionButtonClick = () => {
    if (modalResource.host === currentHost.host) {
      history.push(`/resources/${modalResource._id}`);
    } else {
      window.location.href = `https://${modalResource.host}/resources/${modalResource._id}`;
    }
  };

  const handleCopyLink = async () => {
    const link = `https://${modalResource.host}/resources/${modalResource._id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch (error) {
      console.log(error);
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

  const handleCloseModal = () => {
    setCopied(false);
    setModalResource(null);
  };

  const isAdmin = role === 'admin';

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('domains.resources')} | ${currentHost?.settings?.name}`}</title>
      </Helmet>

      <Box mb="8" mt="4" px="4">
        <Flex justify="space-between">
          <Heading />
          <FiltrerSorter {...filtrerProps}>
            {isPortalHost && (
              <Flex justify={isDesktop ? 'flex-start' : 'center'}>
                <HostFiltrer
                  allHosts={allHostsFiltered}
                  hostFilterValue={hostFilterValue}
                  onHostFilterValueChange={(value, meta) => setHostFilterValue(value)}
                />
              </Flex>
            )}
            <Tabs size="sm" tabs={tabs} index={getTabIndex()} />
          </FiltrerSorter>
        </Flex>
      </Box>

      <Box px="4">
        <InfiniteScroller
          canCreateContent={isAdmin}
          isMasonry
          items={resourcesRendered}
          newHelperLink="/resources/new"
        >
          {(resource) => (
            <Box key={resource._id} cursor="pointer" onClick={() => setModalResource(resource)}>
              <NewGridThumb
                host={isPortalHost ? allHosts.find((h) => h.host === resource.host)?.name : null}
                imageUrl={resource.images?.[0]}
                tag={!resource.isBookable && t('cards.isNotBookable')}
                title={resource.label}
              />
            </Box>
          )}
        </InfiniteScroller>
      </Box>

      {modalResource && (
        <Modal
          actionButtonLabel={
            isPortalHost
              ? tc('actions.toThePage', {
                  hostName: allHosts.find((h) => h.host === modalResource.host)?.name,
                })
              : tc('actions.entryPage')
          }
          h="90%"
          isCentered
          isOpen
          scrollBehavior="inside"
          secondaryButtonLabel={isCopied ? tc('actions.copied') : tc('actions.share')}
          size={isDesktop ? '6xl' : 'full'}
          onActionButtonClick={() => handleActionButtonClick()}
          onClose={handleCloseModal}
          onSecondaryButtonClick={handleCopyLink}
        >
          <Tably
            content={modalResource.description && renderHTML(modalResource.description)}
            images={modalResource.images}
            tags={isPortalHost && [allHosts.find((h) => h.host === modalResource.host)?.name]}
            title={modalResource.label}
          />
        </Modal>
      )}
    </Box>
  );
}

function ResourceItem({ isPortalHost, resource, t }) {
  const { allHosts } = useContext(StateContext);

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
        {isPortalHost && (
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
