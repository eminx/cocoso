import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Link as CLink,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';
import { parseTitle } from '../utils/shared';

function ListMenu({ currentUser, list, onChange, children, ...otherProps }) {
  const { isDesktop } = useContext(StateContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [tc] = useTranslation('common');
  if (!list) {
    return null;
  }

  const isActiveItem = (item) => {
    return pathname.includes(item.value);
  };
  const selectedItem = list.find((item) => {
    return pathname.includes(item.value);
  });

  if (isDesktop) {
    return (
      <List {...otherProps} data-oid="l3lg0l0">
        {list.map((item) => (
          <ListItem key={item.value} p="1" data-oid="vpwi0sl">
            <Link
              to={currentUser ? `/@${currentUser?.username}${item.value}` : item.value}
              data-oid=":4j0ofh"
            >
              <CLink as="span" data-oid="79z2grc">
                <Text fontWeight={isActiveItem(item) ? 'bold' : 'normal'} data-oid="97-yhfx">
                  {item.key == 'publicProfile'
                    ? `@${currentUser?.username}`
                    : tc(`menu.${item.menu}.${item.key}`)}
                </Text>
              </CLink>
            </Link>
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <Box my="2" data-oid="n65ahev">
      <Menu data-oid="0pi_34o">
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon data-oid="h1yiy1l" />}
          data-oid="vgh-:rd"
        >
          {selectedItem ? tc(`menu.${selectedItem.menu}.${selectedItem.key}`) : tc('labels.select')}
        </MenuButton>
        <MenuList data-oid="zx5xsjg">
          {list.map((item) => (
            <MenuItem
              key={item.key}
              onClick={() => navigate(`${parseTitle(item.value)}`)}
              data-oid="e3cbq8o"
            >
              {item.key == 'publicProfile'
                ? `@${currentUser?.username}`
                : tc(`menu.${item.menu}.${item.key}`)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
}

export default ListMenu;
