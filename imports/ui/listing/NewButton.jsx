import React from 'react';
import { useLocation, useSearchParams } from 'react-router';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import { useAtomValue } from 'jotai';

import { IconButton } from '/imports/ui/core';

import {
  canCreateContentAtom,
  currentHostAtom,
  roleAtom,
} from '../LayoutContainer';

const getRoute = (item) => {
  if (item.name === 'info') {
    return '/info/new';
  }
  return `/${item.name}/new`;
};

export default function NewButton() {
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const currentHost = useAtomValue(currentHostAtom);
  const role = useAtomValue(roleAtom);

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const menu = currentHost?.settings?.menu;

  if (!canCreateContent || !menu) {
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

  const activeMenuItem = menuItems.find((item, index) => {
    if (pathname === '/') {
      return index === 0;
    }
    return pathname.includes(item?.name);
  });

  if (!activeMenuItem || ['members', 'people'].includes(activeMenuItem.name)) {
    return null;
  }

  return (
    <IconButton
      css={{ margin: '0 1rem' }}
      icon={<AddIcon />}
      mx="2"
      size="sm"
      variant="outline"
      onClick={() => setSearchParams({ new: 'true' })}
    />
  );
}
