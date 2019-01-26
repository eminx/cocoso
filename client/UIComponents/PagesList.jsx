import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Select, Button, Radio, Dropdown } from 'antd/lib';

import { parseTitle } from '../functions';

const RadioButton = Radio.Button;
const Option = Select.Option;

const activeStyle = {
  // backgroundColor: '#ea3924',
  // color: '#fff',
  fontWeight: 700
};

const linkStyle = {
  textTransform: 'uppercase',
  padding: '6px 12px',
  fontStyle: 'italic'
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
