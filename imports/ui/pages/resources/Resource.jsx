import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ScreenClassRender } from 'react-grid-system';

import { call } from '../../@/shared';
import { message } from '../../components/message';
import NotFoundPage from '../NotFoundPage';
import Loader from '../../components/Loader';
import Template from '../../components/Template';
import Breadcrumb from '../../components/Breadcrumb';
import ResourceCard from './components/ResourceCard';
import DocumentsField from './components/DocumentsField';
import BookingsField from './components/BookingsField';
import { StateContext } from '../../LayoutContainer';
import useChattery from '../../components/chattery/useChattery';

function ResourcePage() {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tc] = useTranslation('common');
  const { currentUser, canCreateContent } = useContext(StateContext);
  const { isChatLoading, discussion } = useChattery(resourceId, currentUser);

  useEffect(() => {
    getResourceById();
  }, []);

  const getResourceById = async () => {
    try {
      const response = await call('getResourceById', resourceId);
      setResource(response);
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      setIsLoading(false);
    }
  };

  // const parseChatData = () => {
  //   const messages = chatData?.messages?.map((message) => {
  //     return {
  //       ...message,
  //       isFromMe: message?.senderId === currentUser?._id,
  //     };
  //   });
  //   setDiscussion(messages);
  // };

  const addNewChatMessage = async (messageContent) => {
    const values = {
      context: 'resource',
      contextId: resource._id,
      message: messageContent,
    };

    try {
      await call('addChatMessage', values);
    } catch (error) {
      console.log('error', error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!resource) {
    return <NotFoundPage domain="Resource with this name or id" />;
  }

  return (
    <ScreenClassRender
      render={(screenClass) => {
        const isMobile = ['xs', 'sm', 'md'].includes(screenClass);
        return (
          <Template
            leftContent={
              !isMobile && (
                <DocumentsField
                  contextType="resource"
                  contextId={resource?._id}
                />
              )
            }
            rightContent={
              currentUser &&
              canCreateContent && (
                <BookingsField
                  currentUser={currentUser}
                  selectedResource={resource}
                />
              )
            }
          >
            <Breadcrumb context={resource} contextKey="label" />
            <ResourceCard
              addNewChatMessage={addNewChatMessage}
              currentUser={currentUser}
              discussion={discussion}
              resource={resource}
            />
            {isMobile && (
              <DocumentsField
                contextType="resource"
                contextId={resource?._id}
              />
            )}
            <Center my="2">
              <Link to={`/resources/${resource?._id}/edit`}>
                <Button size="sm" variant="ghost">
                  {tc('actions.update')}
                </Button>
              </Link>
            </Center>
          </Template>
        );
      }}
    />
  );
}

export default ResourcePage;
