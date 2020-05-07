import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Box, Heading } from 'grommet';

import { UserContext } from '../../LayoutContainer';
import PagesList from '../../UIComponents/PagesList';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';

import { parseTitle } from '../../functions';

class Page extends PureComponent {
  state = {
    pages: null,
    isLoading: true
  };

  componentDidMount() {
    Meteor.call('getPages', (error, respond) => {
      this.setState({
        pages: respond,
        isLoading: false
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
      page => parseTitle(page.title) === parseTitle(routeName)
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

    const pageTitles = pages && pages.map(page => page.title);

    return (
      <Template
        heading={currentPage && currentPage.title}
        leftContent={
          <Box>
            {currentUser && currentUser.isSuperAdmin && (
              <Link to="/new-page" key="new-page" style={{ marginBottom: 12 }}>
                <Button primary label="New Page" />
              </Link>
            )}

            <PagesList
              pageTitles={pageTitles}
              onChange={this.handlePageClick}
              activePageTitle={routeName}
            />
          </Box>
        }
        rightContent={
          currentPage &&
          currentUser &&
          currentUser.isSuperAdmin && (
            <Box pad="small">
              <Link to={`/edit-page/${parseTitle(currentPage.title)}`}>
                {' '}
                <Button label="Edit" as="span" />
              </Link>
            </Box>
          )
        }
      >
        {currentPage && (
          <div
            dangerouslySetInnerHTML={{
              __html: currentPage.longDescription
            }}
          />
        )}
      </Template>
    );
  }
}

Page.contextType = UserContext;

export default Page;
