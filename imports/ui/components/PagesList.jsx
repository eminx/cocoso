import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Box,
  Center,
  Flex,
  Link as CLink,
  List,
  ListItem,
  Select,
  Text,
} from '@chakra-ui/react';

import { parseTitle } from '../@/shared';
import { ScreenClassRender } from 'react-grid-system';

const PagesList = withRouter(({ pageTitles, activePageTitle, history }) => {
  const currentPageTitle = () => {
    pageTitles.find((item) => parseTitle(item) === activePageTitle);
  };

  return (
    <Box>
      <ScreenClassRender
        render={(screen) =>
          ['xs', 'sm'].includes(screen) ? (
            <Center mt="2" mb="8">
              <Select
                placeholder={currentPageTitle()}
                size="sm"
                w="xs"
                onChange={(event) =>
                  history.push(`/page/${parseTitle(event.target.value)}`)
                }
              >
                {pageTitles.map((title) => (
                  <option>{title}</option>
                ))}
              </Select>
            </Center>
          ) : (
            <Box my="6" w="sm">
              <List>
                {pageTitles.map((title) => (
                  <ListItem key={title} p="1">
                    <Link to={`/page/${parseTitle(title)}`}>
                      <CLink as="span">
                        <Text
                          fontWeight={
                            parseTitle(activePageTitle) === parseTitle(title)
                              ? 'bold'
                              : 'normal'
                          }
                        >
                          {title}
                        </Text>
                      </CLink>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Box>
          )
        }
      />
    </Box>
  );
});

export default PagesList;
