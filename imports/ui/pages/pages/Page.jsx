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
import PageHeader from '../../components/PageHeader';

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

  if (false) {
    return (
      <>
        <Helmet>
          <title>{`${currentPage.title} | ${currentHost.settings.name}`}</title>
        </Helmet>

        <PageHeader description={settings.menu.find((item) => item.name === 'info')?.description} />

        <Flex mb="8">
          <Box w="280px" px="4" pt="53px">
            <PagesList activePageTitle={pageId} currentPage={currentPage} pageTitles={pageTitles} />
          </Box>

          <Box maxW="520px" pl="4" w="100%">
            <Box py="4">
              <Heading as="h2" fontFamily="'Raleway', sans-serif" fontSize="24px">
                {currentPage.title}
              </Heading>
            </Box>
            <Center bg="gray.900">
              <NiceSlider floatRight={false} images={currentPage.images} />
            </Center>
            <Box bg="white" className="text-content" maxW="520px" p="4">
              {renderHTML(currentPage.longDescription)}
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
          </Box>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${currentPage.title} | ${settings.name} | ${publicSettings.name}`}</title>
      </Helmet>

      <PageHeader description={settings.menu.find((item) => item.name === 'info')?.description} />

      <Box pb="2">
        <PagesList activePageTitle={pageId} currentPage={currentPage} pageTitles={pageTitles} />
      </Box>

      <Center mb="4">
        <Box w="100%" maxW="520px">
          {currentPage.images && currentPage.images.length > 0 && (
            <Center py="4">
              {/* <Flex flexDirection="column" justify="center"> */}
              <NiceSlider alt={currentPage.title} images={currentPage.images} />
              {/* </Flex> */}
            </Center>
          )}
          <Box
            // bg="white"
            border="1px solid"
            borderColor="brand.500"
            className="text-content"
            maxW="520px"
            m="2"
            p="4"
          >
            {renderHTML(currentPage.longDescription)}
          </Box>
        </Box>
      </Center>

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
