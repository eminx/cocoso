import React, { useContext } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import { StateContext } from '../LayoutContainer';

const getRoute = (item) => {
  if (item.name === 'info') {
    return '/info/new';
  }
  return `/${item.name}/new`;
};

export default function NewButton() {
  const { canCreateContent, currentHost, currentUser, role } = useContext(StateContext);
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const menu = currentHost?.settings?.menu;

  if (!currentUser || !canCreateContent || !menu) {
    return null;
  }

  const isAdmin = role === 'admin';

  const menuItems = menu
    .filter((item) => {
      if (isAdmin) {
        return item.isVisible;
      }
      return item.isVisible && !['info', 'resources'].includes(item.name);
    })
    .map((item, index) => ({
      ...item,
      route: getRoute(item, index),
    }));

  const { pathname } = location;

  const activeMenuItem = menuItems.find(
    (item) => pathname.includes(item.name) && item.name !== 'people'
  );

  if (!activeMenuItem || ['members', 'people'].includes(activeMenuItem.name)) {
    return null;
  }

  return (
    <IconButton
      _hover={{ bg: 'gray.300' }}
      _focus={{ bg: 'gray.400' }}
      as="span"
      bg="gray.200"
      borderColor="gray.200"
      borderWidth="2px"
      borderRadius="lg"
      color="gray.600"
      cursor="pointer"
      icon={<AddIcon />}
      mx="2"
      size="sm"
      onClick={() => setSearchParams({ new: 'true' })}
    />
  );
}
