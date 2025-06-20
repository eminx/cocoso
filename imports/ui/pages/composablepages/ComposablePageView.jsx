import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useHref, useParams } from 'react-router-dom';

import { message } from '/imports/ui/generic/message';
import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import ComposablePageHybrid from '../../entry/ComposablePageHybrid';

export default function ComposablePageView() {
  const initialComposablePage =
    window?.__PRELOADED_STATE__?.composablePage || null;
  const Host = window?.__PRELOADED_STATE__?.Host || null;
  const href = useHref();

  const [composablePage, setComposablePage] = useState(
    initialComposablePage
  );
  const [rendered, setRendered] = useState(false);

  let { currentHost } = useContext(StateContext);
  let { composablePageId } = useParams();

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
      const response = await call(
        'getComposablePageById',
        composablePageId
      );
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

  return (
    <ComposablePageHybrid
      composablePage={composablePage}
      Host={currentHost}
    />
  );
}
