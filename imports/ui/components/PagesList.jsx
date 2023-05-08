import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Link as CLink,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { StateContext } from '../LayoutContainer';
import { parseTitle } from '../utils/shared';

const PagesList = withRouter(({ pageTitles, activePageTitle, history }) => {
  const { isDesktop } = useContext(StateContext);

  const currentPageTitle = pageTitles.find((item) => parseTitle(item) === activePageTitle);

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
        <Center mt="2" mb="8" zIndex="1500">
          <Menu placement="bottom">
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {currentPageTitle}
            </MenuButton>
            <MenuList zIndex={2}>
              {pageTitles.map((title) => (
                <MenuItem
                  key={title}
                  onClick={() => history.push(`/pages/${parseTitle(title)}`)}
                  isDisabled={activePageTitle === parseTitle(title)}
                >
                  {title}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Center>
      )}
    </Box>
  );
});

export default PagesList;
