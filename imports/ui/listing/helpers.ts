import { Host, MenuItem } from '/imports/ui/types';

function itemVisibilityFilter(item: any | undefined, role: string | null) {
  const isPublic =
    item &&
    (!item.hasOwnProperty('visibility') ||
      item.visibility === 'everyone');

  if (isPublic) {
    return true;
  }

  if (!role) {
    return false;
  }

  switch (item.visibility) {
    case 'onlyAdmin':
      return role === 'admin';
    case 'onlyVerified':
      return ['admin', 'contributor'].includes(role);
    case 'onlyUsers':
      return Boolean(role);
    default:
      return false;
  }
}

export function getRenderPass(
  Host: Host,
  LISTING: string,
  role: string | null
) {
  const itemInMenu = Host?.settings?.menu?.find(
    (item: MenuItem) => item.name === LISTING
  );

  return itemVisibilityFilter(itemInMenu, role);
}

export function getMenuItemsVisible(
  menuItems: MenuItem[] | undefined,
  role: string | null
) {
  if (!menuItems ) return [];
  return menuItems.filter((item) => {
    return itemVisibilityFilter(item, role);
  });
}
