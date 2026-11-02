import { Host, MenuItem } from '/imports/ui/types';

export const getRenderPass = (
  Host: Host,
  LISTING: string,
  role: string | null
) => {
  const itemInMenu = Host?.settings?.menu?.find(
    (item: MenuItem) => item.name === LISTING
  );
  console.log('role', role);
  console.log('itemInMenu:', itemInMenu);

  const isPublic =
    itemInMenu &&
    (!itemInMenu.hasOwnProperty('visibility') ||
      itemInMenu.visibility === 'everyone');

  console.log('isPublic:', isPublic);
  console.log('hasOwnProperty', itemInMenu?.hasOwnProperty('visibility'));

  if (isPublic) {
    return true;
  }

  const visibility = itemInMenu?.visibility;

  switch (visibility) {
    case 'onlyAdmin':
      return role === 'admin';
    case 'onlyVerified':
      return ['admin', 'contributor'].includes(role);
    case 'onlyUsers':
      return Boolean(role);
    default:
      return false;
  }
};
