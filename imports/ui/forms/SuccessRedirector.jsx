import React, { useEffect } from 'react';
import { useAtom } from 'jotai';

import { initialLoader, loaderAtom } from '../listing/NewEntryHandler';

export default function SuccessRedirector({ ping, onSuccess, children }) {
  const [loaders, setLoaders] = useAtom(loaderAtom);

  useEffect(() => {
    if (typeof ping === 'string') {
      setLoaders((prevState) => ({ ...prevState, isSuccess: true }));
    }
  }, [ping]);

  useEffect(() => {
    if (loaders?.isSuccess) {
      onSuccess();
    }
  }, [loaders]);

  return <>{children}</>;
}
