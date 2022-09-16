import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Box, Button, Center, Text, Wrap } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import renderHTML from 'react-render-html';
import moment from 'moment';

import { call } from '../../utils/shared';
import { message } from '../../components/message';
import NotFoundPage from '../NotFoundPage';
import Loader from '../../components/Loader';
import Template from '../../components/Template';
import ResourceCard from './components/ResourceCard';
import DocumentsField from './components/DocumentsField';
import BookingsField from './components/BookingsField';
import { StateContext } from '../../LayoutContainer';
import useChattery from '../../components/chattery/useChattery';
import Tably from '../../components/Tably';
import Chattery from '../../components/chattery/Chattery';

function ResourcePage() {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tc] = useTranslation('common');
  const { canCreateContent, currentUser, isDesktop, role } = useContext(StateContext);
  const { isChatLoading, discussion } = useChattery(resourceId, currentUser);

  useEffect(() => {
    getResourceById();
  }, []);

  const removeNotification = () => {};

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
      context: 'resources',
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

  const tabs = [
    {
      title: 'Info',
      content: (
        <Box>
          <div className="text-content">{renderHTML(resource.description)}</div>
          <Text as="p" fontSize="xs">
            {moment(resource.createdAt).format('D MMM YYYY')}
          </Text>
        </Box>
      ),
      path: `/resources/${resource._id}/info`,
    },
    {
      title: 'Documents',
      content: <DocumentsField contextType="resource" contextId={resource?._id} />,
      path: `/resources/${resource._id}/documents`,
    },
  ];

  if (currentUser && canCreateContent) {
    tabs.push({
      title: 'Bookings',
      content: <BookingsField currentUser={currentUser} selectedResource={resource} />,
      path: `/resources/${resource._id}/bookings`,
    });
    if (resource.isCombo) {
      tabs.push({
        title: 'Combo',
        content: (
          <Wrap>
            {resource.resourcesForCombo.map((res, i) => (
              <Badge fontSize="16px">{res.label}</Badge>
            ))}
          </Wrap>
        ),
        path: `/resources/${resource._id}/combo`,
      });
    }
    tabs.push({
      title: 'Discussion',
      content: (
        <div>
          <Chattery
            messages={discussion}
            onNewMessage={addNewChatMessage}
            removeNotification={removeNotification}
            isMember={Boolean(currentUser)}
          />
        </div>
      ),
      path: `/resources/${resource._id}/discussion`,
    });
  }

  const tabNav = {
    path: '/resources',
    label: 'Resources',
  };

  return <Tably nav={tabNav} images={resource.images} tabs={tabs} title={resource.label} />;

  return (
    <ScreenClassRender
      render={(screenClass) => {
        const isMobile = ['xs', 'sm', 'md'].includes(screenClass);
        return (
          <Template
            leftContent={
              !isMobile && <DocumentsField contextType="resource" contextId={resource?._id} />
            }
            rightContent={
              currentUser &&
              canCreateContent && (
                <BookingsField currentUser={currentUser} selectedResource={resource} />
              )
            }
          >
            <ResourceCard
              addNewChatMessage={addNewChatMessage}
              currentUser={currentUser}
              discussion={discussion}
              resource={resource}
            />
            {isMobile && <DocumentsField contextType="resource" contextId={resource?._id} />}

            {role === 'admin' && (
              <Center my="2">
                <Link to={`/resources/${resource?._id}/edit`}>
                  <Button size="sm" variant="ghost">
                    {tc('actions.update')}
                  </Button>
                </Link>
              </Center>
            )}
          </Template>
        );
      }}
    />
  );
}

export default ResourcePage;
