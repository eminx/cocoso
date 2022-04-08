import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

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

function ResourcePage() {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [discussion, setDiscussion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tc] = useTranslation('common');

  const { canCreateContent, currentUser, role } = useContext(StateContext);

  useEffect(() => {
    getResourceById();
    getChatByContextId();
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

  const getChatByContextId = async () => {
    try {
      const response = await call('getChatByContextId', resourceId);
      if (!response) {
        return;
      }
      const messages = response.messages.map((message) => {
        return {
          ...message,
          isFromMe: message?.senderId === currentUser?._id,
        };
      });
      setDiscussion(messages);
    } catch (error) {
      message.error(error.reason);
    }
  };

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

  if (typeof resource === 'undefined')
    return <NotFoundPage domain="Resource with this name or id" />;
  if (isLoading) return <Loader />;

  return (
    <Template
      leftContent={
        <DocumentsField domainType="resource" domainId={resource?._id} />
      }
      rightContent={<BookingsField domain={resource} />}
    >
      <Breadcrumb domain={resource} domainKey="label" />
      <ResourceCard
        addNewChatMessage={addNewChatMessage}
        canCreateContent={canCreateContent}
        discussion={discussion}
        resource={resource}
      />
      <Center my="2">
        <Link to={`/resources/${resource?._id}/edit`}>
          <Button size="sm" variant="ghost">
            {tc('actions.update')}
          </Button>
        </Link>
      </Center>
    </Template>
  );
}

export default ResourcePage;
