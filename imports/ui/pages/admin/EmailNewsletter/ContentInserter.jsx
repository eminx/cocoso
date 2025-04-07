import React, { useState, useEffect } from 'react';
import {
  Box,
  Checkbox,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
} from '@chakra-ui/react';
import CloseIcon from 'lucide-react/dist/esm/icons/x-circle';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import CheckIcon from 'lucide-react/dist/esm/icons/check';

import { call } from '/imports/ui/utils/shared';

import Loader from '../../../generic/Loader';
import { message } from '../../../generic/message';
import { ActivityDates } from './EmailPreview';
import FormField from '../../../forms/FormField';

const yesterday = dayjs(new Date()).add(-1, 'days');

const compareByDate = (a, b) => {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateB - dateA;
};

function ListItemCheckbox({ item, children, onSelect }) {
  if (!item) {
    return null;
  }

  const { isSelected } = item;

  const selectedBgContainer = item.isSelected ? 'green.100' : 'white';
  const selectedBgCheck = item.isSelected ? 'green.500' : 'white';

  return (
    <ListItem
      key={item._id}
      _hover={{
        bg: item.isSelected ? 'green.100' : 'green.50',
        cursor: 'pointer',
      }}
      bg={selectedBgContainer}
      borderBottom="1px solid #eee"
      px="2"
      py="4"
      onClick={() => onSelect(item)}
    >
      <HStack alignItems="center">
        <Box
          bg={selectedBgCheck}
          border="white 2px solid"
          borderRadius="md"
          flexShrink={0}
          h="24px"
          w="24px"
        >
          <CheckIcon color="white" size="20px" />
        </Box>
        <Image
          bg="brand.100"
          fit="cover"
          h="80px"
          src={(item.images && item.images[0]) || item.imageUrl}
          w="80px"
        />
        <Box ml="2" flexShrink={1}>
          <Text fontSize="md" fontWeight="bold">
            {item.title}
          </Text>
          {children}
        </Box>
      </HStack>
    </ListItem>
  );
}

export default function ContentInserter({ currentHost, onSelect }) {
  const [activities, setActivities] = useState([]);
  const [works, setWorks] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [worksLoading, setWorksLoading] = useState(false);
  const [filterWord, setFilterWord] = useState('');
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const isPortalHost = currentHost?.isPortalHost;
  const menu = currentHost?.settings?.menu;
  const activitiesInMenu = menu?.find((item) => item.name === 'activities');
  const worksInMenu = menu?.find((item) => item.name === 'works');

  const getActivities = async () => {
    setActivitiesLoading(true);
    try {
      const allActivities = isPortalHost
        ? await call('getAllPublicActivitiesFromAllHosts')
        : await call('getAllPublicActivities');
      setActivities(allActivities);
    } catch (error) {
      message.error(error.error || error.reason);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const getWorks = async () => {
    setWorksLoading(true);
    try {
      const respond = isPortalHost
        ? await call('getAllWorksFromAllHosts')
        : await call('getAllWorks');
      setWorks(respond.sort(compareByDate));
    } catch (error) {
      message.error(error.error || error.reason);
    } finally {
      setWorksLoading(false);
    }
  };

  useEffect(() => {
    getActivities();
    getWorks();
  }, []);

  const getActivitiesFiltered = () => {
    if (!activities) {
      return null;
    }
    const lowerCaseFilterWord = filterWord === '' ? '' : filterWord.toLowerCase();
    return activities.filter((activity) => {
      const activityWordFiltered =
        activity?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        activity?.subTitle?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;

      return activityWordFiltered;
    });
  };

  const getWorksFiltered = () => {
    if (!works) {
      return null;
    }
    const lowerCaseFilterWord = filterWord === '' ? '' : filterWord.toLowerCase();
    return works.filter((work) => {
      const workWordFiltered =
        work?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        work?.shortDescription?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;

      return workWordFiltered;
    });
  };

  const handleSelectItem = (item, type) => {
    if (type === 'activities') {
      const newActivities = activities.map((activity) => {
        const newActivity = { ...activity };
        if (activity._id === item._id) {
          newActivity.isSelected = !activity.isSelected;
        }
        return newActivity;
      });
      setActivities(newActivities);
      onSelect({
        activities: newActivities.filter((a) => a.isSelected),
        works: works.filter((w) => w.isSelected),
      });
      return;
    }
    if (type === 'works') {
      const newWorks = works.map((work) => {
        const newWork = { ...work };
        if (work._id === item._id) {
          newWork.isSelected = !work.isSelected;
        }
        return newWork;
      });
      setWorks(newWorks);
      onSelect({
        activities: activities.filter((a) => a.isSelected),
        works: newWorks.filter((w) => w.isSelected),
      });
      return;
    }
  };

  const activitiesFiltered = activitiesInMenu?.isVisible && getActivitiesFiltered();
  const worksFiltered = worksInMenu?.isVisible && getWorksFiltered();

  if (!activitiesInMenu?.isVisible && !worksInMenu?.isVisible) {
    return null;
  }

  return (
    <>
      <FormField label={t('newsletter.labels.insertcontent')} mt="4" mb="4">
        <Text color="gray.600" fontSize="sm">
          {t('newsletter.contenthelper')}
        </Text>
        <Tabs mt="4" onChange={() => setFilterWord('')}>
          <TabList>
            {activitiesInMenu?.isVisible && (
              <Tab px="0" mr="4">
                <Text>{activitiesInMenu?.label}</Text>
              </Tab>
            )}
            {worksInMenu?.isVisible && (
              <Tab px="0">
                <Text>{worksInMenu?.label}</Text>
              </Tab>
            )}
          </TabList>

          <InputGroup mt="2" size="sm" w="240px">
            <Input
              placeholder={tc('labels.filter')}
              value={filterWord}
              onChange={(event) => setFilterWord(event.target.value)}
            />
            {filterWord !== '' && (
              <InputRightElement>
                <CloseIcon cursor="pointer" fontSize="2xs" onClick={() => setFilterWord('')} />
              </InputRightElement>
            )}
          </InputGroup>

          <Box maxH="800px" overflowY="scroll">
            <TabPanels>
              {activitiesInMenu?.isVisible && (
                <TabPanel px="0">
                  {!activitiesLoading ? (
                    <List bg="white">
                      {activitiesFiltered?.map((activity) => (
                        <ListItemCheckbox
                          item={activity}
                          onSelect={(item) => handleSelectItem(item, 'activities')}
                        >
                          <ActivityDates activity={activity} />
                        </ListItemCheckbox>
                      ))}
                    </List>
                  ) : (
                    <Loader />
                  )}
                </TabPanel>
              )}

              {worksInMenu?.isVisible && (
                <TabPanel px="0">
                  {!worksLoading ? (
                    <List bg="white">
                      {worksFiltered?.map((work) => (
                        <ListItemCheckbox
                          item={work}
                          onSelect={(item) => handleSelectItem(item, 'works')}
                        >
                          {work.shortDescription}
                        </ListItemCheckbox>
                      ))}
                    </List>
                  ) : (
                    <Loader />
                  )}
                </TabPanel>
              )}
            </TabPanels>
          </Box>
        </Tabs>
      </FormField>
    </>
  );
}
