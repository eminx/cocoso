import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Link as CLink, List, ListItem, Select, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { StateContext } from '../LayoutContainer';
import { parseTitle } from '../utils/shared';

function ListMenu({ currentUser, list, pathname, onChange, children, ...otherProps }) {
  const { isDesktop } = useContext(StateContext);
  const navigate = useNavigate();
  const [tc] = useTranslation('common');
  if (!list) {
    return null;
  }

  const isActiveItem = (item) => {
    return pathname.includes(item.value);
  };

  if (isDesktop) {
    return (
      <List {...otherProps}>
        {list.map((item) => (
          <ListItem key={item.value} p="1">
            <Link to={currentUser ? `/@${currentUser?.username}${item.value}` : item.value}>
              <CLink as="span">
                <Text fontWeight={isActiveItem(item) ? 'bold' : 'normal'}>
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
    <Box mt="2" mb="8">
      <Select w="xs" onChange={(event) => navigate(`${parseTitle(event.target.value)}`)}>
        {list.map((item) => (
          <option key={item.key} value={item.value} selected={isActiveItem(item)}>
            {item.key == 'publicProfile'
              ? `@${currentUser?.username}`
              : tc(`menu.${item.menu}.${item.key}`)}
          </option>
        ))}
      </Select>
    </Box>
  );
}

export default ListMenu;
