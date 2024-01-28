import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Button, Center, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { parseTitle } from '../utils/shared';

const PagesList = withRouter(({ currentPage, pageTitles }) => {
  const history = useHistory();

  return (
    <Center zIndex="1400">
      <Menu placement="bottom">
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="lg" variant="ghost">
          {currentPage?.title}
        </MenuButton>
        <MenuList zIndex={2}>
          {pageTitles.map((title) => (
            <MenuItem
              key={title}
              onClick={() => history.push(`/pages/${parseTitle(title)}`)}
              isDisabled={currentPage?.title === parseTitle(title)}
            >
              {title}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Center>
  );
});

export default PagesList;
