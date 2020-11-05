import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Box } from 'grommet';

import { StateContext } from '../../LayoutContainer';
import PagesList from '../../UIComponents/PagesList';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';

import { parseTitle } from '../../functions';

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
    const { currentUser } = this.context;
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
          currentUser.isSuperAdmin && (
            <Box pad="small" direction="row" justify="center">
              <Link to="/new-page" style={{ marginBottom: 12 }}>
                <Button size="small" label="New Page" />
              </Link>
            </Box>
          )
        }
      >
        <Box pad="medium" background="white" margin={{ bottom: 'medium' }}>
          <div
            dangerouslySetInnerHTML={{
              __html: currentPage.longDescription,
            }}
          />
        </Box>

        {currentUser && currentUser.isSuperAdmin && (
          <Box pad="small" alignSelf="center">
            <Link to={`/edit-page/${parseTitle(currentPage.title)}`}>
              <Button size="small" label="Edit this page" />
            </Link>
          </Box>
        )}
      </Template>
    );
  }
}

Page.contextType = StateContext;

export default Page;
