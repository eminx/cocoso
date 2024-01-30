import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Box, Button, Center, Text } from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../../LayoutContainer';
import PagesList from '../../components/PagesList';
import Loader from '../../components/Loader';
import NiceSlider from '../../components/NiceSlider';
import { parseTitle } from '../../utils/shared';
import PageHeading from '../../components/PageHeading';

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

  const { settings } = currentHost;

  return (
    <>
      <Helmet>
        <title>{`${currentPage.title} | ${settings.name} | ${publicSettings.name}`}</title>
      </Helmet>

      <PageHeading description={settings.menu.find((item) => item.name === 'info')?.description} />

      <Box mt="-2">
        <PagesList activePageTitle={pageId} currentPage={currentPage} pageTitles={pageTitles} />
      </Box>

      <Box>
        {currentPage.images && currentPage.images.length > 0 && (
          <Center py="4">
            <NiceSlider
              alt={currentPage.title}
              isFade={isDesktop}
              height={isDesktop ? '400px' : 'auto'}
              images={currentPage.images}
            />
          </Center>
        )}
        <Center>
          <Box
            border="1px solid"
            borderColor="brand.500"
            className="text-content"
            maxWidth="520px"
            overflow="auto"
            m="2"
            p="4"
          >
            {currentPage.longDescription && renderHTML(currentPage.longDescription)}
          </Box>
        </Center>
      </Box>

      {isAdmin && (
        <Center m="4">
          <Link to={`/pages/${parseTitle(currentPage.title)}/edit`}>
            <Button as="span" variant="ghost" size="sm">
              <Text>{tc('actions.update')}</Text>
            </Button>
          </Link>
        </Center>
      )}
    </>
  );
}

export default Page;
