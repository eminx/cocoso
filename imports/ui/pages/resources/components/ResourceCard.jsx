import React from 'react';
import {
  Badge,
  Box,
  Center,
  Heading,
  Image,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Text,
  Wrap,
} from '@chakra-ui/react';
import renderHTML from 'react-render-html';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import moment from 'moment';

import NiceSlider from '../../../components/NiceSlider';
import Chattery from '../../../components/chattery/Chattery';

moment.locale(i18n.language);

export default function ResourceCard({ currentUser, discussion, resource, addNewChatMessage }) {
  const [t] = useTranslation('resources');

  const removeNotification = () => {};

  if (!resource) {
    return null;
  }

  return (
    <Box bg="white" mb="2" px="4" py="4" key={resource?.label}>
      <Box mb="4">
        <Heading size="md" fontWeight="bold">
          {resource.label} {resource.isCombo && <Badge mt="-2">{t('cards.ifCombo')}</Badge>}
        </Heading>
      </Box>
      <Tabs variant="enclosed-colored">
        <TabList pl="4">
          <Tab>{t('tabs.info')}</Tab>
          {resource.isCombo && (
            <Tab>
              {t('cards.ifCombo')} ({resource.resourcesForCombo.length})
            </Tab>
          )}
          <Tab>{t('tabs.discussion')} </Tab>
        </TabList>
        <TabPanels pt="4">
          <TabPanel p="0">
            {resource?.images && (
              <Box mb="4">
                {resource.images.length === 1 ? (
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

          {resource.isCombo && (
            <TabPanel p="0" minHeight="300px">
              <Box p="4">
                <Wrap>
                  {resource.resourcesForCombo.map((res, i) => (
                    <Badge fontSize="16px">{res.label}</Badge>
                  ))}
                </Wrap>
              </Box>
            </TabPanel>
          )}

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
