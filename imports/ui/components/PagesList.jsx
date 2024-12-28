import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Center, Heading, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

import { parseTitle } from '../utils/shared';

function PagesList({ currentPage, pageTitles }) {
  const navigate = useNavigate();

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
              onClick={() => navigate(`/pages/${parseTitle(title)}`)}
            >
              {title}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Center>
  );
}

export default PagesList;
