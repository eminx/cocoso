import React, { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import { canCreateContentAtom } from '/imports/state';
import {
  initialLoader,
  loaderAtom,
  renderToasts,
} from '/imports/ui/utils/loaderHandler';

import EntryFormHandler from './EntryFormHandler';

export default function EditEntryHandler({ context, children }) {
  const canCreateContent = useAtomValue(canCreateContentAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loaders, setLoaders] = useAtom(loaderAtom);
  const [tc] = useTranslation('common');

  useEffect(() => {
    if (!loaders || !loaders.isCreating) {
      return;
    }
    renderToasts(loaders, tc, true);
  }, [loaders]);

  const handleClose = () => {
    setLoaders({ ...initialLoader });
    setSearchParams((params) => ({ ...params, edit: 'false' }));
  };

  const title = tc(`common:labels.update.${context}`);
  const open = searchParams.get('edit') === 'true';

  if (!canCreateContent) {
    return null;
  }

  const props = {
    open,
    title,
    onClose: handleClose,
    children,
  };

  return <EntryFormHandler {...props} />;
}
