import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Anchor, Button, Box } from 'grommet';
import renderHTML from 'react-render-html';
import { Helmet } from 'react-helmet';

import { StateContext } from '../../LayoutContainer';
import PagesList from '../../UIComponents/PagesList';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';

import { parseTitle } from '../../functions';

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

    const routeName = match.params.id;

    const currentPage = pages.find(
      (page) => parseTitle(page.title) === parseTitle(routeName)
    );
    return currentPage;
  };

  render() {
    const { currentUser, currentHost, role } = this.context;
    const { match } = this.props;
    const { pages, isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    const routeName = match.params.id;

    const currentPage = this.getCurrentPage();

    if (!currentPage && pages && pages.length > 0) {
      return <Redirect to={`/page/${parseTitle(pages[0].title)}`} />;
    }

    if (!currentPage || !currentPage.title || !currentPage.longDescription) {
      return <Loader />;
    }

    const pageTitles = pages && pages.map((page) => page.title);

    return (
      <Template
        heading={currentPage.title}
        leftContent={
          <Box>
            <PagesList
              pageTitles={pageTitles}
              onChange={this.handlePageClick}
              activePageTitle={routeName}
            />
          </Box>
        }
        rightContent={
          currentUser &&
          role === 'admin' && (
            <Box pad="medium" direction="row" justify="center">
              <Link to="/new-page">
                <Button as="span" size="small" label="NEW" />
              </Link>
            </Box>
          )
        }
      >
        <Helmet>
          <title>{`${currentPage.title} | ${currentHost.settings.name} | ${publicSettings.name}`}</title>
        </Helmet>

        <Box pad="medium" background="white" margin={{ bottom: 'medium' }}>
          <div className="text-content">
            {renderHTML(currentPage.longDescription)}
          </div>
        </Box>

        <Box>
          {currentUser && role === 'admin' && (
            <Box pad="medium" alignSelf="center">
              <Link to={`/edit-page/${parseTitle(currentPage.title)}`}>
                <Anchor as="span" size="small" label="Edit this page" />
              </Link>
            </Box>
          )}
        </Box>
      </Template>
    );
  }
}

Page.contextType = StateContext;

export default Page;
