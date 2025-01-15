import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { call } from '../../utils/shared';
import { message } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import TablyCentered from '../../components/TablyCentered';
import { ContentLoader } from '../../components/SkeletonLoaders';
import GroupHybrid from '../../entry/GroupHybrid';

export default function Group() {
  const initialGroup = window?.__PRELOADED_STATE__?.group || null;
  const Host = window?.__PRELOADED_STATE__?.Host || null;

  const [group, setGroup] = useState(initialGroup);
  const { groupId } = useParams();
  let { currentHost } = useContext(StateContext);

  if (!currentHost) {
    currentHost = Host;
  }

  useEffect(() => {
    getGroupById();
  }, []);

  const getGroupById = async () => {
    try {
      const response = await call('getGroupWithMeetings', groupId);
      setGroup(response);
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
  //     context: 'groups',
  //     contextId: group._id,
  //     message: messageContent,
  //   };

  //   try {
  //     await call('addChatMessage', values);
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

  if (!group) {
    return <ContentLoader />;
  }

  return <GroupHybrid group={group} Host={currentHost} />;
}
