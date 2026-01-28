import { atom } from 'jotai';

import type { Host, PageTitle, Platform, Role, User } from './ui/types';

export const allHostsAtom = atom<Host[]>([]);
export const currentHostAtom = atom<Host | null>(null);
export const currentUserAtom = atom<User | null>(null);
export const isDesktopAtom = atom<boolean>(true);
export const isMobileAtom = atom<boolean>(false);
export const pageTitlesAtom = atom<PageTitle[]>([]);
export const platformAtom = atom<Platform | null>(null);
export const renderedAtom = atom<boolean>(false);
export const roleAtom = atom<Role>(null);
export const canCreateContentAtom = atom<boolean>((get) => {
  const role = get(roleAtom);
  return role !== null && ['admin', 'contributor'].includes(role);
});
