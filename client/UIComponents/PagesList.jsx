import React from 'react';
import { withRouter } from 'react-router-dom';
import { Text, Anchor } from 'grommet';

import ListMenu from '../UIComponents/ListMenu';

import { parseTitle } from '../functions';

const PagesList = withRouter(({ pageTitles, activePageTitle, history }) => {
  return (
    <ListMenu list={pageTitles}>
      {title => (
        <Anchor
          onClick={() => history.push(`/page/${parseTitle(title)}`)}
          label={
            <Text
              weight={
                parseTitle(activePageTitle) === parseTitle(title)
                  ? 'bold'
                  : 'normal'
              }
            >
              {title}
            </Text>
          }
        />
      )}
    </ListMenu>
  );
});

export default PagesList;
