import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Radio } from 'antd/lib';

import { parseTitle } from '../functions';

const RadioButton = Radio.Button;

const activeStyle = {
  backgroundColor: '#ea3924'
};

const PagesList = props => (
  <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
    {props.pageTitles.map((title, index) => (
      <Link to={`/page/${parseTitle(title)}`} key={title + index}>
        <Button
          block
          value={title}
          style={
            parseTitle(props.activePageTitle) === parseTitle(title)
              ? activeStyle
              : null
          }
        >
          {title}
        </Button>
      </Link>
    ))}
  </div>
);

export default PagesList;
