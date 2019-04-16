import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd/lib';
import PagesList from '../../UIComponents/PagesList';
import Loader from '../../UIComponents/Loader';

import { parseTitle } from '../../functions';

class Work extends PureComponent {
  render() {
    const { work, isLoading } = this.props;

    if (!work || isLoading) {
      return <Loader />;
    }

    const author =
      work.authorFirstName && work.authorLastName
        ? work.authorFirstName + ' ' + work.authorLastName
        : work.authorUsername;

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col lg={6}>
            <h2 style={{ marginBottom: 0 }}>{work.title}</h2>
            <h4 style={{ fontWeight: 300 }}>{author}</h4>
            <p>
              <b>{work.shortDescription}</b>
            </p>
          </Col>

          <Col lg={12}>
            <div style={{ paddingBottom: 12 }}>
              <img
                width="100%"
                height="100%"
                alt={work.title}
                src={work.imageUrl}
              />
            </div>
          </Col>

          <Col lg={6}>
            <div dangerouslySetInnerHTML={{ __html: work.description }} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Work;
