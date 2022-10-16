import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Box, Button, Center, Flex, Heading } from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { Helmet } from 'react-helmet';
import { Trans } from 'react-i18next';

import { StateContext } from '../../LayoutContainer';
import PagesList from '../../components/PagesList';
import Loader from '../../components/Loader';

import { parseTitle } from '../../utils/shared';
import Header from '../../components/Header';

const publicSettings = Meteor.settings.public;

class Page extends PureComponent {
  state = {
    pages: null,
    isLoading: true,
  };

  componentDidMount() {
    Meteor.call('getPages', (error, respond) => {
      this.setState({
        pages: respond,
        isLoading: false,
      });
    });
  }

  getCurrentPage = () => {
    const { match } = this.props;
    const { pages } = this.state;
    if (!pages || pages.length === 0) {
      return;
    }

    const param = match.params.pageId;

    const currentPage = pages.find((page) => parseTitle(page.title) === parseTitle(param));
    return currentPage;
  };

  render() {
    const { currentHost, currentUser, isDesktop, role } = this.context;
    const { match } = this.props;
    const { pages, isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    const param = match.params.pageId;

    const currentPage = this.getCurrentPage();

    if (!currentPage && pages && pages.length > 0) {
      return <Redirect to={`/pages/${parseTitle(pages[0].title)}`} />;
    }

    if (!currentPage || !currentPage.title || !currentPage.longDescription) {
      return <Loader />;
    }

    const pageTitles = pages && pages.map((page) => page.title);

    return (
      <>
        <Helmet>
          <title>{`${currentPage.title} | ${currentHost.settings.name} | ${publicSettings.name}`}</title>
        </Helmet>

        <Header />

        {!isDesktop && (
          <Center px="4">
            <PagesList
              pageTitles={pageTitles}
              onChange={this.handlePageClick}
              activePageTitle={param}
            />
          </Center>
        )}

        <Flex mt={isDesktop ? '8' : '0'}>
          {isDesktop && (
            <Box w="30%" p="4" pl="12">
              <PagesList
                pageTitles={pageTitles}
                onChange={this.handlePageClick}
                activePageTitle={param}
              />
            </Box>
          )}
          <Box p="4" w={isDesktop ? '40%' : '100%'}>
            <Box mb="4">
              <Heading as="h2" size="lg">
                {currentPage.title}
              </Heading>
            </Box>
            <Box className={currentPage.isTermsPage && 'is-terms-page'} maxW="520px">
              <div className="text-content">{renderHTML(currentPage.longDescription)}</div>
            </Box>
          </Box>
        </Flex>

        {currentUser && role === 'admin' && !currentPage.isTermsPage && (
          <Center p="2">
            <Link to={`/pages/${parseTitle(currentPage.title)}/edit`}>
              <Button as="span" variant="ghost" size="sm">
                <Trans i18nKey="common:actions.update" />
              </Button>
            </Link>
          </Center>
        )}
      </>
    );
  }
}

Page.contextType = StateContext;

export default Page;
