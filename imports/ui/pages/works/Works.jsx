import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Wrap, WrapItem } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';
import { parse, stringify } from 'query-string';

import NewGridThumb from '../../components/NewGridThumb';
import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Tag from '../../components/Tag';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import { getHslValuesFromLength } from '../../utils/constants/colors';
import FiltrerSorter from '../../components/FiltrerSorter';
import Modal from '../../components/Modal';
import Tably from '../../components/Tably';
import HostFiltrer from '../../components/HostFiltrer';
import { Heading } from '../../components/Header';
import InfiniteScroller from '../../components/InfiniteScroller';
import PageHeader from '../../components/PageHeader';

const compareByDate = (a, b) => {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateB - dateA;
};

function Works({ history }) {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWord, setFilterWord] = useState('');
  const [sorterValue, setSorterValue] = useState('date');
  const [modalWork, setModalWork] = useState(null);
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const [isCopied, setCopied] = useState(false);
  const { allHosts, canCreateContent, currentHost, isDesktop } = useContext(StateContext);
  const [tc] = useTranslation('common');
  const [t] = useTranslation('members');

  const {
    location: { search },
  } = history;

  const { category } = parse(search);

  useEffect(() => {
    getAllWorks();
  }, []);

  const isPortalHost = currentHost.isPortalHost;

  const getAllWorks = async () => {
    try {
      if (isPortalHost) {
        setWorks(await call('getAllWorksFromAllHosts'));
      } else {
        setWorks(await call('getAllWorks'));
      }
    } catch (error) {
      message.error(error.reason);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !works) {
    return <Loader />;
  }

  const getSortedWorks = () => {
    if (sorterValue === 'name') {
      return works.sort((a, b) => a.title?.localeCompare(b.title));
    }
    return works.sort(compareByDate);
  };

  const getFilteredWorks = () => {
    const lowerCaseFilterWord = filterWord === '' ? '' : filterWord.toLowerCase();
    if (category) {
      return getSortedWorks().filter((work) => {
        const workWordFiltered = work?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
        return work.category && work.category.label === category.toLowerCase() && workWordFiltered;
      });
    } else {
      return getSortedWorks().filter((work) => {
        const workWordFiltered = work?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
        return workWordFiltered;
      });
    }
  };

  const setCategoryFilter = (categoryFilter) => {
    const params = stringify({ category: categoryFilter });
    history.push({ search: params });
  };

  const categoriesAssignedToWorks = getCategoriesAssignedToWorks(works);

  const worksWithCategoryColors = getFilteredWorks().map((work, index) => {
    const category = categoriesAssignedToWorks.find((category) => {
      return (
        category.label &&
        category.label === (work.category && work.category.label && work.category.label)
      );
    });
    const categoryColor = category && category.color;
    return {
      ...work,
      categoryColor,
    };
  });

  const getWorksRenderedHostFiltered = (worksRendered) => {
    if (!isPortalHost || !hostFilterValue) {
      return worksRendered;
    }
    return worksRendered.filter((work) => work.host === hostFilterValue.host);
  };

  const handleActionButtonClick = () => {
    if (modalWork.host === currentHost.host) {
      history.push(`/@${modalWork.authorUsername}/works/${modalWork._id}`);
    } else {
      window.location.href = `https://${modalWork.host}/@${modalWork.authorUsername}/works/${modalWork._id}`;
    }
  };

  const handleCopyLink = async () => {
    const link = `https://${modalWork.host}/@${modalWork.authorUsername}/works/${modalWork._id}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setCopied(false);
    setModalWork(null);
  };

  const worksRenderedHostFiltered = getWorksRenderedHostFiltered(worksWithCategoryColors);

  const allHostsFiltered = allHosts?.filter((host) => {
    return worksWithCategoryColors.some((work) => work.host === host.host);
  });

  const filtrerProps = {
    filterWord,
    setFilterWord,
    sorterValue,
    setSorterValue,
  };

  const { settings } = currentHost;

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('domains.works')} | ${currentHost.settings.name}`}</title>
      </Helmet>

      <PageHeader
        description={settings.menu.find((item) => item.name === 'works')?.description}
        numberOfItems={worksRenderedHostFiltered?.length}
      >
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
        </FiltrerSorter>
      </PageHeader>

      <Wrap mb="8" mt="4" px="4">
        <WrapItem>
          <Tag
            label={t('all')}
            checkable
            checked={Boolean(category) === false}
            filterColor="#2d2d2d"
            onClick={() => setCategoryFilter(null)}
          />
        </WrapItem>
        {categoriesAssignedToWorks.map((cat) => (
          <WrapItem key={cat.label}>
            <Tag
              checkable
              checked={category === cat.label}
              filterColor={cat.color}
              label={cat.label && cat.label.toUpperCase()}
              margin={{ bottom: 'small' }}
              onClick={() => setCategoryFilter(cat.label)}
            />
          </WrapItem>
        ))}
      </Wrap>

      <Box px={isDesktop ? '4' : '0'}>
        <InfiniteScroller
          canCreateContent={canCreateContent}
          isMasonry
          items={worksRenderedHostFiltered}
          newHelperLink="/works/new"
        >
          {(work) => (
            <Box key={work._id} cursor="pointer" onClick={() => setModalWork(work)}>
              <NewGridThumb
                avatar={
                  work.showAvatar && {
                    name: work.authorUsername,
                    url: work.authorAvatar,
                  }
                }
                color={
                  categoriesAssignedToWorks.find((cat) => cat?.label === work.category?.label)
                    ?.color
                }
                host={isPortalHost && allHosts?.find((h) => h.host === work.host)?.name}
                imageUrl={work.images && work.images[0]}
                tag={work.category?.label}
                title={work.title}
              />
            </Box>
          )}
        </InfiniteScroller>
      </Box>

      {modalWork && (
        <Modal
          actionButtonLabel={
            isPortalHost
              ? tc('actions.toThePage', {
                  hostName: allHosts?.find((h) => h.host === modalWork.host)?.name,
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
            author={
              modalWork.showAvatar && {
                src: modalWork.authorAvatar,
                username: modalWork.authorUsername,
              }
            }
            content={modalWork.longDescription && renderHTML(modalWork.longDescription)}
            images={modalWork.images}
            subTitle={modalWork.shortDescription}
            tags={[
              modalWork.category?.label,
              isPortalHost ? allHosts?.find((h) => h.host === modalWork.host)?.name : null,
            ]}
            title={modalWork.title}
          />
        </Modal>
      )}
    </Box>
  );
}

getCategoriesAssignedToWorks = (works) => {
  const labels = Array.from(new Set(works.map((work) => work.category && work.category.label)));

  const hslValues = getHslValuesFromLength(labels.length);
  return labels
    .map((label, i) => ({
      label,
      color: hslValues[i],
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export default Works;
