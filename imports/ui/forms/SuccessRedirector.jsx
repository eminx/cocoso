import React, { useContext, useEffect } from 'react';

import { initialLoader, LoaderContext } from '../listing/NewEntryHandler';

export default function SuccessRedirector({ ping, onSuccess, children }) {
  const { loaders, setLoaders } = useContext(LoaderContext);

  useEffect(() => {
    if (typeof ping === 'string') {
      setLoaders((prevState) => ({ ...prevState, isSuccess: true }));
    }
    setTimeout(() => {
      setLoaders(initialLoader);
    }, 1200);
  }, [ping]);

  useEffect(() => {
    if (loaders?.isSuccess) {
      onSuccess();
    }
  }, [loaders]);

  return <>{children}</>;
}
