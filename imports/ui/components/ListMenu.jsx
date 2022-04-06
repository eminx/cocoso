import React from 'react';
import { Link } from 'react-router-dom';
import { Link as CLink, List, ListItem, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function ListMenu({ list, pathname, children, ...otherProps }) {
  const [ tc ] = useTranslation('common');
  if (!list) {
    return null;
  }
  return (
    <List {...otherProps}>
      {list.map((item) => (
        <ListItem key={item.value} p="1">
          <Link to={item.value}>
            <CLink as="span">
              <Text fontWeight={pathname === item.value ? 'bold' : 'normal'}>
                {tc(`menu.${item.menu}.${item.key}`)}
              </Text>
            </CLink>
          </Link>
        </ListItem>
      ))}
    </List>
  );
}

export default ListMenu;
