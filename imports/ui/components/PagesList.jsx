import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Center, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { StateContext } from '../LayoutContainer';
import { parseTitle } from '../utils/shared';
import Tabs from './Tabs';

const PagesList = withRouter(({ pageTitles, activePageTitle, history }) => {
  const { isDesktop } = useContext(StateContext);

  const currentPageTitle = pageTitles.find((item) => parseTitle(item) === activePageTitle);

  if (isDesktop) {
    const tabs = pageTitles.map((title) => ({
      title: title,
      path: `/pages/${parseTitle(title)}`,
    }));

    return <Tabs forceUppercase={false} orientation="vertical" tabs={tabs} textAlign="left" />;
  }

  return (
    <Center mb="4" zIndex="1500">
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
  );
});

export default PagesList;
