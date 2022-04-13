import React from 'react';
import {
  Box,
  Heading,
  Flex,
  Image,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tag,
  Text,
  Center,
} from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import moment from 'moment';
moment.locale(i18n.language);

import NiceSlider from '../../../components/NiceSlider';
import Chattery from '../../../components/chattery/Chattery';

export default function ResourcesCard({
  currentUser,
  discussion,
  resource,
  addNewChatMessage,
  isThumb,
}) {
  const [t] = useTranslation('resources');

  const removeNotification = () => {};

  if (!resource) {
    return null;
  }

  return (
    <Box bg="white" mb="2" px="4" py="4" key={resource?.label}>
      <Flex justifyContent="space-between" alignItems="flex-start" mb="4">
        <Heading size="md" fontWeight="bold">
          {resource?.isCombo ? (
            <ResourcesForCombo resource={resource} />
          ) : (
            resource?.label
          )}
        </Heading>
        {/* <Link href={'/@'+resource.user?.username}>
          <Flex alignItems="center">
            <Text 
              fontSize="xs"
              fontWeight="medium"
              textAlign="center"
              mr="2"
              >
              {resource.user?.username}
            </Text>
            <Avatar 
              size="xs"
              name={resource.user?.username}
              src={resource.user?.avatar ? resource.user?.avatar : null}
            />
          </Flex>
        </Link> */}
      </Flex>
      <Tabs variant="enclosed-colored">
        {!isThumb && (
          <TabList pl="4">
            <Tab>{t('tabs.info')}</Tab>
            <Tab>{t('tabs.discussion')} </Tab>
          </TabList>
        )}
        <TabPanels pt="4">
          <TabPanel p="0">
            {resource?.images && (
              <Box mb="4">
                {resource.images.length === 1 || isThumb ? (
                  <Center>
                    <Image src={resource.images[0]} fit="contain" fill />
                  </Center>
                ) : (
                  <NiceSlider images={resource.images} />
                )}
              </Box>
            )}
            <Box>
              <Box className="text-content" mb="4">
                {resource.description && renderHTML(resource.description)}
              </Box>
              <Text as="p" fontSize="xs">
                {moment(resource.createdAt).format('D MMM YYYY')}
              </Text>
            </Box>
          </TabPanel>
          <TabPanel p="0">
            {discussion && (
              <div>
                <Chattery
                  messages={discussion}
                  onNewMessage={addNewChatMessage}
                  removeNotification={removeNotification}
                  isMember={Boolean(currentUser)}
                />
              </div>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

function ResourcesForCombo({ resource }) {
  const [t] = useTranslation('resources');
  const resourcesForCombo = resource?.resourcesForCombo;
  const length = resource?.resourcesForCombo.length;

  return (
    <span>
      <Flex mb="2">
        <Text mr="2">{resource?.label}</Text>
        <Tag size="sm" textTransform="uppercase">
          {t('cards.ifCombo')}
        </Tag>
      </Flex>
      {' ['}
      {resourcesForCombo.map((res, i) => (
        <Text as="span" fontSize="sm" key={res._id}>
          {res.label + (i < length - 1 ? ' + ' : '')}
        </Text>
      ))}
      ]
    </span>
  );
}
