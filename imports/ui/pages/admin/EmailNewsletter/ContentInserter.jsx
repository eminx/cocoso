import React, { useState, useEffect } from 'react';
import CloseIcon from 'lucide-react/dist/esm/icons/x-circle';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import CheckIcon from 'lucide-react/dist/esm/icons/check';
import {
  Box,
  Flex,
  HStack,
  Image,
  Loader,
  Input,
  List,
  ListItem,
  Tabs,
  Text,
} from '/imports/ui/core';
import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';
import FormField from '/imports/ui/forms/FormField';

import { ActivityDates } from './EmailPreview';

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
      css={{
        borderBottom: '1px solid #eee',
        backgroundColor: item.isSelected
          ? 'var(--cocoso-colors-green-100)'
          : 'white',
        cursor: 'pointer',
        padding: '1rem 0.5rem',
        ':hover': {
          backgroundColor: item.isSelected
            ? 'var(--cocoso-colors-green-100)'
            : 'var(--cocoso-colors-green-50)',
        },
      }}
      onClick={() => onSelect(item)}
    >
      <HStack alignItems="center">
        <Box
          bg={selectedBgCheck}
          h="24px"
          w="24px"
          css={{
            border: 'white 2px solid',
            borderRadius: 'md',
          }}
        >
          <CheckIcon color="white" size="20px" />
        </Box>
        <Image
          fit="cover"
          h="80px"
          src={(item.images && item.images[0]) || item.imageUrl}
          css={{
            backgroundColor: 'var(--cocoso-colors-theme-100)',
          }}
          w="80px"
        />
        <Box ml="2" css={{ flexShrink: '1' }}>
          <Text fontSize="lg" fontWeight="bold">
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
  const [activeTab, setActiveTab] = useState(0);
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
    const lowerCaseFilterWord =
      filterWord === '' ? '' : filterWord.toLowerCase();
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
    const lowerCaseFilterWord =
      filterWord === '' ? '' : filterWord.toLowerCase();
    return works.filter((work) => {
      const workWordFiltered =
        work?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        work?.shortDescription?.toLowerCase().indexOf(lowerCaseFilterWord) !==
          -1;

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

  const activitiesFiltered =
    activitiesInMenu?.isVisible && getActivitiesFiltered();
  const worksFiltered = worksInMenu?.isVisible && getWorksFiltered();

  const tabs = [];

  if (activitiesInMenu?.isVisible) {
    tabs.push({
      label: activitiesInMenu?.label,
      items: activitiesFiltered,
      onClick: () => setActiveTab(0),
    });
  }

  if (worksInMenu?.isVisible) {
    tabs.push({
      label: worksInMenu?.label,
      items: worksFiltered,
      onClick: () => setActiveTab(1),
    });
  }

  console.log(tabs);

  return (
    <>
      <FormField label={t('newsletter.labels.insertcontent')} />
      <Text color="gray.600" fontSize="sm">
        {t('newsletter.contenthelper')}
      </Text>

      <Tabs mt="4" tabs={tabs} index={activeTab} />

      <Flex align="center" mt="2" w="240px">
        <Input
          placeholder={tc('labels.filter')}
          value={filterWord}
          onChange={(event) => setFilterWord(event.target.value)}
        />
        {filterWord !== '' && (
          <Box>
            <CloseIcon
              cursor="pointer"
              fontSize="2xs"
              onClick={() => setFilterWord('')}
            />
          </Box>
        )}
      </Flex>

      <Box maxH="800px" overflowY="scroll">
        {activitiesInMenu?.isVisible && (
          <Box>
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
          </Box>
        )}

        {worksInMenu?.isVisible && (
          <Box>
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
          </Box>
        )}
      </Box>
    </>
  );
}
