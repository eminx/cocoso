import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Box, Button, Center, Text } from '@chakra-ui/react';

import PagesList from '../../components/PagesList';
import PageHybrid from '../../entry/PageHybrid';
import { StateContext } from '../../LayoutContainer';

const publicSettings = Meteor.settings.public;

function Page() {
  const initialPages = window?.__PRELOADED_STATE__?.pages || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [pages, setPages] = useState(initialPages);
  let { currentHost } = useContext(StateContext);

  if (!currentHost) {
    currentHost = Host;
  }

  useEffect(() => {
    Meteor.call('getPages', (error, respond) => {
      setPages(respond);
    });
  }, []);

  return <PageHybrid pages={pages} Host={currentHost} />;
}

export default Page;
