import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col } from 'antd/lib';
import { Button, Box, Heading } from 'grommet';

import { UserContext } from '../../LayoutContainer';
import PagesList from '../../UIComponents/PagesList';
import Loader from '../../UIComponents/Loader';

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
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col md={6}>
            {currentUser && currentUser.isSuperAdmin && (
              <div style={{ marginBottom: 12 }}>
                <Link to="/new-page" key="new-page">
                  <Button primary label="New Page" />
                </Link>
              </div>
            )}
            <PagesList
              pageTitles={pageTitles}
              onChange={this.handlePageClick}
              activePageTitle={routeName}
            />
          </Col>

          <Col md={12}>
            <div
              style={{
                marginBottom: 24
              }}
            >
              <Heading level={3}>{currentPage && currentPage.title}</Heading>

              <Box style={{ color: '#030303' }} animation="fadeIn">
                {currentPage && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentPage.longDescription
                    }}
                  />
                )}
              </Box>
            </div>
          </Col>
          <Col md={6}>
            {currentPage && currentUser && currentUser.isSuperAdmin && (
              <Link to={`/edit-page/${parseTitle(currentPage.title)}`}>
                {' '}
                <Button label="Edit" as="span" />
              </Link>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

Page.contextType = UserContext;

export default Page;
