import React from 'react';
import { useLocation, useSearchParams } from 'react-router';
import AddIcon from 'lucide-react/dist/esm/icons/plus';
import { useAtomValue } from 'jotai';

import { IconButton } from '/imports/ui/core';

import { canCreateContentAtom, currentHostAtom, roleAtom } from '../../state';

interface MenuItem {
  name: string;
  isVisible?: boolean;
}

const getRoute = (item: MenuItem): string => {
  if (item.name === 'info') {
    return '/info/new';
  }
  return `/${item.name}/new`;
};

export type NewButtonAnimState = 'pending' | 'idle' | 'intro' | 'subtle';

interface NewButtonProps {
  animState?: NewButtonAnimState;
}

export default function NewButton({ animState = 'idle' }: NewButtonProps) {
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const currentHost = useAtomValue(currentHostAtom);
  const role = useAtomValue(roleAtom);

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const { pathname } = location;
  const menu = currentHost?.settings?.menu;
  const isAdmin = role === 'admin';

  const menuItems = (menu ?? [])
    .filter((item) => {
      if (isAdmin) {
        return item.isVisible;
      }
      return item.isVisible && !['info', 'resources'].includes(item.name);
    })
    .map((item) => ({
      ...item,
      route: getRoute(item),
    }));

  const activeMenuItem = menuItems.find((item, index) => {
    if (pathname === '/') {
      return index === 0;
    }
    return pathname.includes(item?.name);
  });

  const isVisible =
    Boolean(currentHost) &&
    Boolean(canCreateContent) &&
    Boolean(menu) &&
    Boolean(activeMenuItem) &&
    !['members', 'people'].includes(activeMenuItem?.name ?? '');

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`new-button-wrapper new-button-${animState}`}>
      <svg
        className="new-button-ring"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/*
          r=48 + stroke-width=4: stroke spans r=46–r=50.
          r=50 = SVG boundary = button outer edge → stroke sits on the border.
          rotate(-90) shifts start point from 3 o'clock to 12 o'clock.
        */}
        <circle
          className="new-button-ring-path"
          cx="50"
          cy="50"
          r="48"
          pathLength={100}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <IconButton
        aria-label="Create new"
        css={{ margin: '0 1rem' }}
        icon={<AddIcon />}
        mx="2"
        size="sm"
        variant="outline"
        onClick={() => setSearchParams({ new: 'true' })}
      />
    </div>
  );
}
