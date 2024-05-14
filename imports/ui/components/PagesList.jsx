import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Button, Center, Heading, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { parseTitle } from '../utils/shared';

const PagesList = withRouter(({ currentPage, pageTitles }) => {
  const history = useHistory();

  if (pageTitles?.length === 1) {
    return (
      <Center zIndex="1400">
        <Heading color="gray.800" size="md">
          {currentPage?.title}
        </Heading>
      </Center>
    );
  }

  return (
    <Center zIndex="1400">
      <Menu placement="bottom">
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          size="lg"
          variant="ghost"
          whiteSpace="normal"
        >
          {currentPage?.title}
        </MenuButton>
        <MenuList zIndex={2}>
          {pageTitles.map((title) => (
            <MenuItem
              key={title}
              isDisabled={currentPage?.title === parseTitle(title)}
              maxW="320px"
              whiteSpace="normal"
              onClick={() => history.push(`/pages/${parseTitle(title)}`)}
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
