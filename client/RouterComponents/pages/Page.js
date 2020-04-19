import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd/lib';

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
      console.log(respond.absoluteUrl);
      this.setState({
        pages: respond.pages,
        isLoading: false
      });
    });
  }

  render() {
    const { currentUser } = this.context;
    const { match } = this.props;
    const { pages, isLoading } = this.state;

    const pageId = match.params.id;

    const currentPage =
      pages && pages.length > 0
        ? pages.find(page => parseTitle(page.title) === parseTitle(pageId))
        : null;

    const pageTitles = pages ? pages.map(page => page.title) : [];

    if (isLoading) {
      return <Loader />;
    }

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col md={8}>
            {currentUser && currentUser.isSuperAdmin && (
              <div style={{ marginBottom: 12 }}>
                <Link to="/new-page" key="new-page">
                  <Button type="primary">New Page</Button>
                </Link>
              </div>
            )}
            <PagesList
              pageTitles={pageTitles}
              onChange={this.handlePageClick}
              activePageTitle={pageId}
            />
          </Col>

          <Col md={10}>
            <div
              style={{
                marginBottom: 24
              }}
            >
              <h2>{currentPage && currentPage.title}</h2>
              <div style={{ color: '#030303' }}>
                {currentPage && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentPage.longDescription
                    }}
                  />
                )}
              </div>
            </div>
          </Col>
          <Col md={4}>
            {currentPage && currentUser && currentUser.isSuperAdmin && (
              <Link to={`/edit-page/${parseTitle(currentPage.title)}`}>
                {' '}
                <Button>Edit</Button>
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
