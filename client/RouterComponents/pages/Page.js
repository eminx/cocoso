import React from 'react';

import { Row, Col, Card } from 'antd/lib';

class Page extends React.Component {
  render() {
    const { page, pages, currentUser, isLoading, history } = this.props;
    console.log(pages, 'wtf');
    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col md={4}>
            {pages.map(page => (
              <div key={page.title}>{page.title}</div>
            ))}
            <div>New Page</div>
          </Col>
          <Col md={16}>
            <Card
              title={page && <h2>{page.title}</h2>}
              bordered
              style={{ width: '100%', marginBottom: 0 }}
              cover={
                page && page.imageUrl ? (
                  <img alt="group-image" src={page.imageUrl} />
                ) : null
              }
            >
              <Card.Meta description={page && page.longDescription} />
            </Card>
          </Col>
          <Col md={4} />
        </Row>
      </div>
    );
  }
}

export default Page;
