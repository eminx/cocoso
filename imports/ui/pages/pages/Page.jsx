import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Box, Button, Center, Flex, Heading, Text } from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../../LayoutContainer';
import PagesList from '../../components/PagesList';
import Loader from '../../components/Loader';
import NiceSlider from '../../components/NiceSlider';
import { parseTitle } from '../../utils/shared';
import NewEntryHelper from '../../components/NewEntryHelper';

const publicSettings = Meteor.settings.public;

function Page() {
  const { currentHost, currentUser, isDesktop, role } = useContext(StateContext);
  const [pages, setPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { pageId } = useParams();
  const [tc] = useTranslation('common');

  useEffect(() => {
    Meteor.call('getPages', (error, respond) => {
      setPages(respond);
      setIsLoading(false);
    });
  }, []);

  const currentPage = pages?.find((page) => parseTitle(page?.title) === parseTitle(pageId));

  if (isLoading) {
    return <Loader />;
  }

  if (!currentPage && pages && pages.length > 0) {
    return <Redirect to={`/pages/${parseTitle(pages[0].title)}`} />;
  }

  if (!currentPage || !currentPage.title || !currentPage.longDescription) {
    return <Loader />;
  }

  const pageTitles = pages && pages.map((page) => page.title);

  const isAdmin = currentUser && role === 'admin';

  const renderEditButton = () => {
    if (!isAdmin) {
      return null;
    }
    return (
      <Center p="2">
        <Link to={`/pages/${parseTitle(currentPage.title)}/edit`}>
          <Button as="span" variant="ghost" size="sm">
            <Text>{tc('actions.update')}</Text>
          </Button>
        </Link>
      </Center>
    );
  };

  if (isDesktop) {
    return (
      <>
        <Helmet>
          <title>{`${currentPage.title} | ${currentHost.settings.name}`}</title>
        </Helmet>

        <Flex mt="4">
          <Box w="280px" px="6">
            <PagesList
              pageTitles={pageTitles}
              onChange={this.handlePageClick}
              activePageTitle={pageId}
            />
          </Box>

          <Box w="100%" maxW="520px">
            <Box px="4" mb="4">
              <Heading as="h2" size="lg">
                {currentPage.title}
              </Heading>
            </Box>
            <Box mb="4">
              <NiceSlider images={currentPage.images} />
            </Box>
            <Box p="4" className={currentPage.isTermsPage && 'is-terms-page'} maxW="520px">
              <div className="text-content">{renderHTML(currentPage.longDescription)}</div>
            </Box>
          </Box>
          {isAdmin && (
            <Box ml="8">
              <NewEntryHelper title={tc('labels.newPage')} buttonLink="/pages/new" />
            </Box>
          )}
        </Flex>

        {renderEditButton()}
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${currentPage.title} | ${currentHost.settings.name} | ${publicSettings.name}`}</title>
      </Helmet>

      <Center px="4">
        <PagesList
          pageTitles={pageTitles}
          onChange={this.handlePageClick}
          activePageTitle={pageId}
        />
      </Center>

      <Center>
        <Box w="100%" maxW="520px">
          <Box px="6" mb="4">
            <Heading as="h2" size="lg">
              {currentPage.title}
            </Heading>
          </Box>
          <Box mb="4">
            <NiceSlider images={currentPage.images} />
          </Box>
          <Box px="6" className={currentPage.isTermsPage && 'is-terms-page'} maxW="520px">
            <div className="text-content">{renderHTML(currentPage.longDescription)}</div>
          </Box>
        </Box>
      </Center>

      {isAdmin && (
        <Box>
          <NewEntryHelper buttonLink="/pages/new" />
        </Box>
      )}

      {renderEditButton()}
    </>
  );
}

export default Page;
