import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHref, useNavigate, useParams } from 'react-router';
import { useAtomValue } from 'jotai';

import { message } from '/imports/ui/generic/message';
import {
  currentHostAtom,
  currentUserAtom,
  roleAtom,
} from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';

import ComposablePageHybrid from '../../entry/ComposablePageHybrid';

export default function ComposablePageView() {
  const initialComposablePage =
    window?.__PRELOADED_STATE__?.composablePage || null;
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const currentHost = useAtomValue(currentHostAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const role = useAtomValue(roleAtom);
  const href = useHref();
  const [composablePage, setComposablePage] = useState(initialComposablePage);
  const [rendered, setRendered] = useState(false);
  let { composablePageId } = useParams();
  const navigate = useNavigate();

  if (!currentHost) {
    currentHost = Host;
  }

  if (href === '/' && !composablePageId) {
    composablePageId = currentHost?.settings?.menu[0]?.name;
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  const getComposablePageById = async () => {
    try {
      const response = await call('getComposablePageById', composablePageId);
      setComposablePage(response);
    } catch (error) {
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getComposablePageById();
  }, [composablePageId]);

  if (!composablePage) {
    return null;
  }

  if (!composablePage.isPublished) {
    if (!currentUser || role !== 'admin') {
      navigate('/404');
    }
  }

  return (
    <ComposablePageHybrid composablePage={composablePage} Host={currentHost} />
  );
}
