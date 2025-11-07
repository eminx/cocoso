import { atom } from 'jotai';

export const allHostsAtom = atom([]);
export const currentHostAtom = atom(null);
export const currentUserAtom = atom(null);
export const isDesktopAtom = atom(true);
export const isMobileAtom = atom(false);
export const pageTitlesAtom = atom([]);
export const platformAtom = atom(null);
export const renderedAtom = atom(false);
export const roleAtom = atom(null);

export const canCreateContentAtom = atom((get) => {
  const role = get(roleAtom);
  return role && ['admin', 'contributor'].includes(role);
});
