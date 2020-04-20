import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd/lib';

import { parseTitle } from '../functions';

export const activeStyle = {
  fontWeight: 700
};

export const linkStyle = {
  textTransform: 'uppercase',
  padding: '6px 0'
};

const PagesList = props => (
  <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
    <Row>
      <Col md={24}>
        {props.pageTitles.map((title, index) => (
          <div
            key={title + index}
            style={
              parseTitle(props.activePageTitle) === parseTitle(title)
                ? { ...activeStyle, ...linkStyle }
                : linkStyle
            }
          >
            <Link to={`/page/${parseTitle(title)}`}>{title}</Link>
          </div>
        ))}
      </Col>
    </Row>
  </div>
);

export default PagesList;
