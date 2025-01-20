import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Center, Heading, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

import { parseTitle } from '../utils/shared';

function PagesList({ currentPage, pages }) {
  const navigate = useNavigate();

  if (pages?.length === 1) {
    return (
      <Center zIndex="1400" data-oid="ezs0iwp">
        <Heading color="gray.800" size="md" data-oid="gxp55e:">
          {currentPage?.title}
        </Heading>
      </Center>
    );
  }

  return (
    <Center zIndex="1400" data-oid="-j4oatl">
      <Menu placement="bottom" data-oid="582y5no">
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon data-oid="3.s0xkh" />}
          size="lg"
          variant="ghost"
          whiteSpace="normal"
          data-oid="19t4k4g"
        >
          {currentPage?.title}
        </MenuButton>
        <MenuList zIndex={2} data-oid="eviaxsq">
          {pages.map((p) => (
            <MenuItem
              key={p.title + p.creationDate}
              isDisabled={currentPage?.title === parseTitle(p.title)}
              maxW="320px"
              whiteSpace="normal"
              onClick={() => navigate(`/pages/${parseTitle(p.title)}`)}
              data-oid="5r1yi1u"
            >
              {p.title}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Center>
  );
}

export default PagesList;
