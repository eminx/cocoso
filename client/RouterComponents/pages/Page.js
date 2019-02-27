import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd/lib';
import PagesList from '../../UIComponents/PagesList';
import Loader from '../../UIComponents/Loader';

import { parseTitle } from '../../functions';

class Page extends PureComponent {
  render() {
    const { pages, pageId, currentUser, isLoading, history } = this.props;
    const pageTitles = pages ? pages.map(page => page.title) : [];
    const page =
      pages && pages.length > 0
        ? pages.find(page => parseTitle(page.title) === parseTitle(pageId))
        : null;

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
              <h2>{page && page.title}</h2>
              <div style={{ whiteSpace: 'pre-line', color: '#030303' }}>
                {page && page.longDescription}
              </div>
            </div>
          </Col>
          <Col md={4}>
            {page && currentUser && currentUser.isSuperAdmin && (
              <Link to={`/edit-page/${parseTitle(page.title)}`}>
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

export default Page;
