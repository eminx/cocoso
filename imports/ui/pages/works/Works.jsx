import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Wrap, WrapItem } from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import renderHTML from 'react-render-html';

import Paginate from '../../components/Paginate';
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
import NewEntryHelper from '../../components/NewEntryHelper';
import SexyThumb from '../../components/SexyThumb';
import { Heading } from '../../components/Header';

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
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [modalWork, setModalWork] = useState(null);
  const [hostFilterValue, setHostFilterValue] = useState(null);
  const { allHosts, canCreateContent, currentHost, isDesktop } = useContext(StateContext);
  const [tc] = useTranslation('common');

  useEffect(() => {
    getAllWorks();
  }, []);

  const getAllWorks = async () => {
    try {
      if (currentHost.isPortalHost) {
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
      return works.sort((a, b) => a.title.localeCompare(b.title));
    }
    return works.sort(compareByDate);
  };

  const getFilteredWorks = () => {
    const lowerCaseFilterWord = filterWord === '' ? '' : filterWord.toLowerCase();
    if (categoryFilter) {
      return getSortedWorks().filter((work) => {
        const workWordFiltered = work?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
        return (
          work.category && work.category.label === categoryFilter.toLowerCase() && workWordFiltered
        );
      });
    } else {
      return getSortedWorks().filter((work) => {
        const workWordFiltered = work?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;
        return workWordFiltered;
      });
    }
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
    if (!currentHost.isPortalHost || !hostFilterValue) {
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

  return (
    <Box width="100%" mb="100px">
      <Helmet>
        <title>{`${tc('domains.works')} | ${currentHost.settings.name}`}</title>
      </Helmet>

      <Box px="4">
        <Flex align="center" justify="space-between" my="4">
          <Heading />
          <FiltrerSorter {...filtrerProps}>
            {currentHost.isPortalHost && (
              <Flex justify={isDesktop ? 'flex-start' : 'center'}>
                <HostFiltrer
                  allHosts={allHostsFiltered}
                  hostFilterValue={hostFilterValue}
                  onHostFilterValueChange={(value, meta) => setHostFilterValue(value)}
                />
              </Flex>
            )}
          </FiltrerSorter>
        </Flex>

        <Wrap mb="4">
          <WrapItem>
            <Tag
              label="ALL"
              checkable
              checked={categoryFilter === null}
              filterColor="#2d2d2d"
              onClick={() => setCategoryFilter(null)}
            />
          </WrapItem>
          {categoriesAssignedToWorks.map((cat) => (
            <WrapItem key={cat.label}>
              <Tag
                checkable
                checked={categoryFilter === cat.label}
                filterColor={cat.color}
                label={cat.label && cat.label.toUpperCase()}
                margin={{ bottom: 'small' }}
                onClick={() => setCategoryFilter(cat.label)}
              />
            </WrapItem>
          ))}
        </Wrap>
      </Box>

      <Box px={isDesktop ? '4' : '0'}>
        <Paginate centerItems items={worksRenderedHostFiltered}>
          {(work) => (
            <Box key={work._id}>
              {currentHost.isPortalHost ? (
                <Box cursor="pointer" onClick={() => setModalWork(work)}>
                  <SexyThumb
                    avatar={{
                      name: work.authorUsername,
                      url: work.authorAvatar,
                    }}
                    color={
                      categoriesAssignedToWorks.find((cat) => cat?.label === work.category?.label)
                        .color
                    }
                    host={allHosts.find((h) => h.host === work.host)?.name}
                    imageUrl={work.images[0]}
                    tag={work.category?.label}
                    title={work.title}
                    subTitle={work.shortDescription}
                  />
                </Box>
              ) : (
                <Link to={`/@${work.authorUsername}/works/${work._id}`}>
                  <SexyThumb
                    avatar={{
                      name: work.authorUsername,
                      url: work.authorAvatar,
                    }}
                    color={
                      categoriesAssignedToWorks.find((cat) => cat?.label === work.category?.label)
                        .color
                    }
                    imageUrl={work.images[0]}
                    tag={work.category?.label}
                    title={work.title}
                  />
                </Link>
              )}
            </Box>
          )}
        </Paginate>
        {canCreateContent && <NewEntryHelper buttonLink="/works/new" />}
      </Box>

      {modalWork && (
        <Modal
          h="90%"
          isCentered
          isOpen
          scrollBehavior="inside"
          size="6xl"
          onClose={() => setModalWork(null)}
          actionButtonLabel={tc('actions.toThePage', {
            hostName: allHosts.find((h) => h.host === modalWork.host)?.name,
          })}
          onActionButtonClick={() => handleActionButtonClick()}
        >
          <Tably
            author={{
              src: modalWork.authorAvatar,
              username: modalWork.authorUsername,
            }}
            content={modalWork.longDescription && renderHTML(modalWork.longDescription)}
            images={modalWork.images}
            subTitle={modalWork.shortDescription}
            tags={[
              modalWork.category?.label,
              allHosts.find((h) => h.host === modalWork.host)?.name,
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
