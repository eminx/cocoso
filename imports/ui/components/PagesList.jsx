import React, { useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Box, Button, Center, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { StateContext } from '../LayoutContainer';
import { parseTitle } from '../utils/shared';
import Tabs from './Tabs';

const PagesList = withRouter(({ activePageTitle, currentPage, pageTitles }) => {
  const { isDesktop } = useContext(StateContext);
  const history = useHistory();

  if (isDesktop) {
    const tabs = pageTitles.map((title) => ({
      title: title,
      path: `/pages/${parseTitle(title)}`,
    }));

    const tabIndex = tabs?.findIndex((tab) => tab.path === history?.location?.pathname);

    return (
      <Tabs
        forceUppercase={false}
        index={tabIndex}
        orientation="vertical"
        tabs={tabs}
        textAlign="left"
      />
    );
  }

  return (
    <Box zIndex="1400">
      <Menu placement="bottom">
        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />} variant="outline">
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
    </Box>
  );
});

export default PagesList;
