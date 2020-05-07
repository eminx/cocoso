import React from 'react';
import { Link } from 'react-router-dom';
import { Text } from 'grommet';

import ListMenu from '../UIComponents/ListMenu';

import { parseTitle } from '../functions';

const PagesList = ({ pageTitles, activePageTitle }) => {
  return (
    <ListMenu list={pageTitles}>
      {title => (
        <Link to={`/page/${parseTitle(title)}`}>
          <Text
            weight={
              parseTitle(activePageTitle) === parseTitle(title)
                ? 'bold'
                : 'normal'
            }
          >
            {title}
          </Text>
        </Link>
      )}
    </ListMenu>
  );
};

export default PagesList;
