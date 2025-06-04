import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

import { message } from '/imports/ui/generic/message';
import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { Heading, Text, Image } from '/imports/ui/core';
import ComposablePageHybrid from '../../entry/ComposablePageHybrid';

export default function ComposablePageView() {
  const initialComposablePage =
    window?.__PRELOADED_STATE__?.composablePage || null;
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [composablePage, setComposablePage] = useState(
    initialComposablePage
  );
  const [rendered, setRendered] = useState(false);

  let { currentHost } = useContext(StateContext);
  const { composablePageId } = useParams();

  if (!currentHost) {
    currentHost = Host;
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
      console.log('error', error);
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
    <>
      <Heading
        size="xl"
        css={{ textAlign: 'center', margin: '1rem 0' }}
      >
        {composablePage.title}
      </Heading>
      <ComposablePageHybrid
        composablePage={composablePage}
        Host={currentHost}
      />
    </>
  );
}
