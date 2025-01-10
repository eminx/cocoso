import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Badge, Box, Wrap } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import parseHtml from 'html-react-parser';
import { Helmet } from 'react-helmet';

import { call } from '../../utils/shared';
import { message } from '../../components/message';
import NotFoundPage from '../NotFoundPage';
import Loader from '../../components/Loader';
import DocumentsField from './components/DocumentsField';
import BookingsField from './components/BookingsField';
import { StateContext } from '../../LayoutContainer';
import useChattery from '../../components/chattery/useChattery';
import TablyCentered from '../../components/TablyCentered';
import Chattery from '../../components/chattery/Chattery';

function ResourcePage() {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tc] = useTranslation('common');
  const [t] = useTranslation('resources');
  const { canCreateContent, currentHost, currentUser, role } = useContext(StateContext);
  const { isChatLoading, discussion } = useChattery(resourceId, currentUser);

  useEffect(() => {
    getResourceById();
  }, []);

  const removeNotification = () => {};

  const getResourceById = async () => {
    try {
      const response = await call('getResourceById', resourceId);
      setResource(response);
      const docs = await call('getDocumentsByAttachments', response._id);
      setDocuments(docs);
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
      title: tc('labels.info'),
      content: (
        <Box bg="white" className="text-content" p="6">
          {resource.description && parseHtml(resource.description)}
        </Box>
      ),
      path: 'info',
    },
  ];

  if (documents && documents[0]) {
    tabs.push({
      title: tc('documents.label'),
      content: <DocumentsField contextType="resource" contextId={resource?._id} />,
      path: 'documents',
    });
  }

  if (currentUser && canCreateContent && resource.isBookable) {
    tabs.push({
      title: t('booking.labels.field'),
      content: <BookingsField currentUser={currentUser} selectedResource={resource} />,
      path: 'bookings',
    });
    if (resource.isCombo) {
      tabs.push({
        title: tc('labels.combo'),
        content: (
          <Wrap>
            {resource.resourcesForCombo.map((res, i) => (
              <Badge key={res._id} fontSize="16px">
                {res.label}
              </Badge>
            ))}
          </Wrap>
        ),
        path: 'combo',
      });
    }
    tabs.push({
      title: tc('labels.discussion'),
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
      path: 'discussion',
    });
  }

  const adminMenu = {
    label: 'Admin',
    items: [
      {
        label: tc('actions.update'),
        link: 'edit',
      },
    ],
  };

  const tags = [];
  if (resource.isCombo) {
    tags.push(t('cards.isCombo'));
  }

  if (resource.isBookable && canCreateContent) {
    tags.push(t('cards.isBookable'));
  }

  const resourcesInMenu = currentHost?.settings?.menu?.find((item) => item.name === 'resources');
  const backLink = {
    value: '/resources',
    label: resourcesInMenu?.label,
  };

  return (
    <>
      <Helmet>
        <title>{resource.label}</title>
      </Helmet>
      <TablyCentered
        adminMenu={role === 'admin' ? adminMenu : null}
        backLink={backLink}
        images={resource.images}
        tabs={tabs}
        tags={tags}
        title={resource.label}
      />
    </>
  );
}

export default ResourcePage;
