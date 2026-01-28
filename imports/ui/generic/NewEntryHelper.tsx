import React from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';
import { useAtomValue } from 'jotai';

import { Box } from '/imports/ui/core';

import { currentHostAtom } from '../../state';

export interface NewEntryHelperProps {
  buttonLabel?: string;
  buttonLink: string;
  children?: React.ReactNode;
  isEmptyListing?: boolean;
  small?: boolean;
  title?: string;
}

function NewEntryHelper({
  buttonLabel,
  buttonLink,
  children,
  isEmptyListing = false,
  small = false,
  title,
}: NewEntryHelperProps) {
  const currentHost = useAtomValue(currentHostAtom);
  const location = useLocation();
  const [tc] = useTranslation('common');

  const activeMenuItem = currentHost?.settings?.menu?.find((item: any) =>
    location?.pathname?.split('/').includes(item.name)
  );

  const titleGeneric = isEmptyListing
    ? parseHtml(tc('message.newentryhelper.emptylisting.title'))
    : parseHtml(
        tc('message.newentryhelper.title', { listing: activeMenuItem?.label })
      );

  const descriptionGeneric = isEmptyListing
    ? tc('message.newentryhelper.emptylisting.description')
    : tc('message.newentryhelper.description');

  const buttonLabelGeneric = tc('message.newentryhelper.button');

  const w = '100%';
  const h = small ? '240px' : '315px';

  return (
    <Link className="sexy-thumb-container" to={buttonLink}>
      <Box
        bg="theme.50"
        h={h}
        px="4"
        py="8"
        w={w}
        css={{
          border: '1px solid',
          borderColor: 'var(--cocoso-colors-theme-500)',
          fontWeight: 'bold',
          '&:hover': {
            bg: 'var(--cocoso-colors-theme-100)',
          },
          ':active': {
            bg: 'var(--cocoso-colors-theme-200)',
          },
        }}
      >
        <h3
          className="thumb-title"
          style={{ color: 'var(--cocoso-colors-theme-500)' }}
        >
          {titleGeneric}
        </h3>
        <h4
          className="thumb-subtitle"
          style={{ color: 'var(--cocoso-colors-theme-500)' }}
        >
          {descriptionGeneric}
        </h4>
      </Box>
    </Link>
  );
}
export default NewEntryHelper;
