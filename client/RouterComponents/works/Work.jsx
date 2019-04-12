import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd/lib';
import PagesList from '../../UIComponents/PagesList';
import Loader from '../../UIComponents/Loader';

import { parseTitle } from '../../functions';

class Work extends PureComponent {
  render() {
    const { work } = this.props;

    return (
      <div style={{ padding: 24 }}>
        <h2>{work && work.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: work && work.description }} />
      </div>
    );
  }
}

export default Work;
