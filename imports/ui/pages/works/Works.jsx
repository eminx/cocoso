import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Center, Flex } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import NewGridThumb from '../../components/NewGridThumb';
import { StateContext } from '../../LayoutContainer';
import Tag from '../../components/Tag';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import { getHslValuesFromLength } from '../../utils/constants/colors';
import FiltrerSorter from '../../components/FiltrerSorter';
import Modal from '../../components/Modal';
import Tably from '../../components/Tably';
import HostFiltrer from '../../components/HostFiltrer';
import InfiniteScroller from '../../components/InfiniteScroller';
import PageHeading from '../../components/PageHeading';
import { ContentLoader } from '../../components/SkeletonLoaders';

const compareByDate = (a, b) => {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateB - dateA;
};

function Works() {
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
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category');

  useEffect(() => {
    getAllWorks();
  }, []);

  const isPortalHost = Boolean(currentHost?.isPortalHost);

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
    return <ContentLoader items={4} />;
  }

  const getSortedWorks = () => {
    if (sorterValue === 'name') {
      return works.sort((a, b) => a.title?.localeCompare(b.title));
    }
    return works.sort(compareByDate);
  };

  const getFilteredWorks = () => {
    const lowerCaseFilterWord = filterWord === '' ? '' : filterWord.toLowerCase();
    if (!category || category === 'all') {
      return getSortedWorks().filter((work) => {
        const workWordFiltered = work?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
        return workWordFiltered;
      });
    } else {
      return getSortedWorks().filter((work) => {
        const workWordFiltered = work?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
        return work.category && work.category.label === category.toLowerCase() && workWordFiltered;
      });
    }
  };

  const setCategoryFilter = (categoryFilter) => {
    setSearchParams((params) => {
      // if (!categoryFilter) {
      //   return params;
      // }
      params.set('category', categoryFilter);
      return params;
    });
  };

  const categoriesAssignedToWorks = getCategoriesAssignedToWorks(works);

  const worksWithCategoryColors = getFilteredWorks().map((work, index) => {
    const category = categoriesAssignedToWorks.find((category) => {
      return (
        category.label &&
        category.label === (work.category && work.category.label && work.category.label)
      );
    });
    const categoryColor = category?.color;
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
      navigate(`/@${modalWork.authorUsername}/works/${modalWork._id}/info`);
    } else {
      window.location.href = `https://${modalWork.host}/@${modalWork.authorUsername}/works/${modalWork._id}/info`;
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

  const getButtonLabel = () => {
    if (!isPortalHost || modalWork?.host === currentHost?.host) {
      return tc('actions.entryPage');
    }
    return tc('actions.toThePage', {
      hostName: allHosts?.find((h) => h?.host === modalWork?.host)?.name,
    });
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

  const settings = currentHost?.settings;
  const title = settings?.menu.find((item) => item.name === 'works')?.label;
  const description = settings.menu.find((item) => item.name === 'works')?.description;
  const imageUrl = worksRenderedHostFiltered?.find((w) => w?.images && w.images[0])?.images[0];

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description?.substring(0, 150)} />
        <meta property="og:title" content={title?.substring(0, 30)} />
        <meta property="og:description" content={description?.substring(0, 60)} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={currentHost.host} />
      </Helmet>

      <PageHeading description={description} numberOfItems={worksRenderedHostFiltered?.length}>
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
      </PageHeading>

      <Center p="4" pt="0">
        <Flex justify="center" wrap="wrap">
          <Tag
            label={t('all')}
            checkable
            checked={Boolean(category) === false || category === 'all'}
            mb="2"
            mr="2"
            onClick={() => setCategoryFilter('all')}
          />
          {categoriesAssignedToWorks.map((cat) => (
            <Tag
              key={cat.label}
              checkable
              checked={category === cat.label}
              filterColor={cat.color}
              label={cat.label && cat.label.toUpperCase()}
              mb="2"
              mr="2"
              onClick={() => setCategoryFilter(cat.label)}
            />
          ))}
        </Flex>
      </Center>

      <Box pr="4">
        <InfiniteScroller
          canCreateContent={canCreateContent}
          isMasonry
          items={worksRenderedHostFiltered}
          newHelperLink="/works/new"
        >
          {(work) => (
            <Box
              key={work._id}
              bg="white"
              cursor="pointer"
              mb="4"
              onClick={() => setModalWork(work)}
            >
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
                imageUrl={work?.images && work.images[0]}
                tag={work.category?.label}
                title={work.title}
              />
            </Box>
          )}
        </InfiniteScroller>
      </Box>

      {modalWork && (
        <Modal
          actionButtonLabel={getButtonLabel()}
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
              // modalWork.category?.label,
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
