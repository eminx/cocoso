import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAtom, useAtomValue } from 'jotai';

import { canCreateContentAtom } from '/imports/state';
import {
  initialLoader,
  loaderAtom,
  renderToasts,
} from '/imports/ui/utils/loaderHandler';

import EntryFormHandler from './EntryFormHandler';

export default function NewEntryHandler({ context, children }) {
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loaders, setLoaders] = useAtom(loaderAtom);
  const [tc] = useTranslation('common');

  useEffect(() => {
    if (!loaders) {
      return;
    }
    renderToasts(loaders, tc);
  }, [loaders]);

  const handleClose = () => {
    setLoaders({ ...initialLoader });
    setSearchParams((params) => ({ ...params, new: 'false' }));
  };

  if (!canCreateContent) {
    return null;
  }

  const title = tc(`common:labels.create.${context}`);
  const open = searchParams.get('new') === 'true';

  const props = {
    open,
    title,
    onClose: handleClose,
    children,
  };

  return <EntryFormHandler {...props} />;
}
