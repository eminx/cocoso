import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { call } from '../../utils/shared';
import { message } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import TablyCentered from '../../components/TablyCentered';
import { ContentLoader } from '../../components/SkeletonLoaders';
import ResourceHybrid from '../../entry/ResourceHybrid';

export default function Resource() {
  const initialResource = window?.__PRELOADED_STATE__?.resource || null;
  const initialDocuments = window?.__PRELOADED_STATE__?.documents || [];
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [resource, setResource] = useState(initialResource);
  const [documents, setDocuments] = useState(initialDocuments);
  const { resourceId } = useParams();
  let { canCreateContent, currentHost, currentUser, role } = useContext(StateContext);

  if (!currentHost) {
    currentHost = Host;
  }

  useEffect(() => {
    getResourceById();
  }, []);

  const getResourceById = async () => {
    try {
      const response = await call('getResourceById', resourceId);
      setResource(response);
      const docs = await call('getDocumentsByAttachments', response._id);
      setDocuments(docs);
    } catch (error) {
      message.error(error.reason);
    }
  };

  // const removeNotification = () => {};

  // const parseChatData = () => {
  //   const messages = chatData?.messages?.map((message) => {
  //     return {
  //       ...message,
  //       isFromMe: message?.senderId === currentUser?._id,
  //     };
  //   });
  //   setDiscussion(messages);
  // };

  // const addNewChatMessage = async (messageContent) => {
  //   const values = {
  //     context: 'resources',
  //     contextId: resource._id,
  //     message: messageContent,
  //   };

  //   try {
  //     await call('addChatMessage', values);
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

  if (!resource) {
    return <ContentLoader />;
  }

  return <ResourceHybrid documents={documents} resource={resource} Host={currentHost} />;
}
