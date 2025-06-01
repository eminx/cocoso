import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { message } from '/imports/ui/generic/message';
import { StateContext } from '/imports/ui/LayoutContainer';
import { call } from '/imports/ui/utils/shared';
import { Heading, Text, Image } from '/imports/ui/core';
import SpecialPageHybrid from '/imports/ui/entry/SpecialPageHybrid';

export default function SpecialPageView() {
  const initialSpecialPage = window?.__PRELOADED_STATE__?.specialPage || null;
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [specialPage, setSpecialPage] = useState(initialSpecialPage);
  const [rendered, setRendered] = useState(false);

  let { currentHost } = useContext(StateContext);
  const { specialPageId } = useParams();

  if (!currentHost) {
    currentHost = Host;
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      setRendered(true);
    }, 1000);
  }, []);

  const getSpecialPageById = async () => {
    try {
      const response = await call('getSpecialPageById', specialPageId);
      setSpecialPage(response);
    } catch (error) {
      console.log('error', error);
      message.error(error.reason || error.error);
    }
  };

  useEffect(() => {
    getSpecialPageById();
  }, [specialPageId]);

  if (!specialPage) {
    return null;
  }

  return (
    <>
      <Heading size="xl" css={{ textAlign: 'center' }}>
        {specialPage.title}
      </Heading>
      <SpecialPageHybrid specialPage={specialPage} Host={currentHost} />
    </>
  );
}
