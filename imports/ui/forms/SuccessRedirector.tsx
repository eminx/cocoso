import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useNavigate, useRevalidator, useSearchParams } from 'react-router';

import { initialLoader, loaderAtom } from '/imports/ui/utils/loaderHandler';

export interface SuccessRedirectorProps {
  context?: string;
  forEdit?: boolean;
  ping?: string;
  children?: React.ReactNode;
}

export default function SuccessRedirector({
  context,
  forEdit = false,
  ping,
  children,
}: SuccessRedirectorProps) {
  const [, setLoaders] = useAtom(loaderAtom);
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSuccess = () => {
    const resetLoaders = () =>
      setTimeout(() => {
        setLoaders({ ...initialLoader });
      }, 1200);

    if (forEdit) {
      revalidate();
      resetLoaders();
      setTimeout(() => {
        setSearchParams({ edit: 'false' });
      }, 1400);
    } else {
      resetLoaders();
      setTimeout(() => {
        navigate(`/${context}/${ping}`);
      }, 1400);
    }
  };

  useEffect(() => {
    if (typeof ping !== 'string') return;
    setLoaders((prevState) => ({ ...prevState, isSuccess: true }));
    handleSuccess();
  }, [ping]);

  if (
    searchParams.get('edit') !== 'true' &&
    searchParams.get('new') !== 'true'
  ) {
    return null;
  }

  return children;
}
