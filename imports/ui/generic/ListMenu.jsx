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

function ListMenu({ list }) {
  const { isDesktop } = useContext(StateContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [tc] = useTranslation('common');
  if (!list) {
    return null;
  }

  const isActiveItem = (item) => pathname.includes(item.value);

  const selectedItem = list.find((item) => pathname.includes(item.value));

  if (isDesktop) {
    return (
      <List>
        {list.map((item) => (
          <ListItem key={item.value} p="1">
            <Link to={item.value}>
              <CLink as="span">
                <Text fontWeight={isActiveItem(item) ? 'bold' : 'normal'}>
                  {tc(`menu.${item.menu}.${item.key}`)}
                </Text>
              </CLink>
            </Link>
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <Box my="2">
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {selectedItem ? tc(`menu.${selectedItem.menu}.${selectedItem.key}`) : tc('labels.select')}
        </MenuButton>
        <MenuList>
          {list.map((item) => (
            <MenuItem key={item.key} onClick={() => navigate(`${parseTitle(item.value)}`)}>
              {tc(`menu.${item.menu}.${item.key}`)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
}

export default ListMenu;
