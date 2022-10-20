import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Box, Center, Link as CLink, List, ListItem, Select, Text } from '@chakra-ui/react';

import { StateContext } from '../LayoutContainer';
import { parseTitle } from '../utils/shared';

const PagesList = withRouter(({ pageTitles, activePageTitle, history }) => {
  const { isDesktop } = useContext(StateContext);

  const currentPageTitle = () => {
    pageTitles.find((item) => parseTitle(item) === activePageTitle);
  };

  return (
    <Box>
      {isDesktop ? (
        <List>
          {pageTitles.map((title) => (
            <ListItem key={title} p="1">
              <Link to={`/pages/${parseTitle(title)}`}>
                <CLink as="span">
                  <Text
                    fontWeight={
                      parseTitle(activePageTitle) === parseTitle(title) ? 'bold' : 'normal'
                    }
                  >
                    {title}
                  </Text>
                </CLink>
              </Link>
            </ListItem>
          ))}
        </List>
      ) : (
        <Center mt="2" mb="8">
          <Select
            placeholder={currentPageTitle()}
            w="xs"
            onChange={(event) => history.push(`/pages/${parseTitle(event.target.value)}`)}
          >
            {pageTitles.map((title) => (
              <option selected={parseTitle(activePageTitle) === parseTitle(title)} key={title}>
                {title}
              </option>
            ))}
          </Select>
        </Center>
      )}
    </Box>
  );
});

export default PagesList;
