import React from 'react';
import { withRouter } from 'react-router-dom';
import { Box, Select, Text, Anchor } from 'grommet';

import ListMenu from '../UIComponents/ListMenu';

import { parseTitle } from '../functions';
import { ScreenClassRender } from 'react-grid-system';

const PagesList = withRouter(({ pageTitles, activePageTitle, history }) => {
  return (
    <Box>
      <ScreenClassRender
        render={(screen) =>
          screen === 'xs' ? (
            <Box width="small" alignSelf="center" margin={{ bottom: 'medium' }}>
              <Select
                size="small"
                plain
                placeholder="Pages..."
                name="pages"
                options={pageTitles}
                value={activePageTitle}
                onChange={({ option }) =>
                  history.push(`/page/${parseTitle(option)}`)
                }
              />
            </Box>
          ) : (
            <Box
              width="small"
              alignSelf={screen !== 'lg' ? 'center' : 'start'}
              margin={{ bottom: 'medium' }}
            >
              <ListMenu list={pageTitles}>
                {(title) => (
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
            </Box>
          )
        }
      />
    </Box>
  );
});

export default PagesList;
