import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  Center,
  Flex,
  Link as CLink,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import parseHtml from 'html-react-parser';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import { useTranslation } from 'react-i18next';

import Modal from '/imports/ui/core/Modal';
import CalendarView from './CalendarView';
import ConfirmModal from '../../generic/ConfirmModal';
import Tag from '../../generic/Tag';
import {
  call,
  getNonComboResourcesWithColor,
  getComboResourcesWithColor,
  parseAllBookingsWithResources,
} from '../../utils/shared';
import { StateContext } from '../../LayoutContainer';
import PageHeading from '../../listing/PageHeading';

const animatedComponents = makeAnimated();
const maxResourceLabelsToShow = 13;

const parseNewEntryParams = (slotInfo, selectedResource, type) => {
  const params = {
    startDate: dayjs(slotInfo?.start).format('YYYY-MM-DD'),
    endDate: dayjs(slotInfo?.end).format('YYYY-MM-DD'),
    startTime: dayjs(slotInfo?.start).format('HH:mm'),
    endTime: dayjs(slotInfo?.end).format('HH:mm'),
    resourceId: selectedResource ? selectedResource._id : '',
  };

  if (type !== 'other') {
    params.endDate = dayjs(slotInfo?.end)
      .add(-1, 'days')
      .format('YYYY-MM-DD');
    params.endTime = '23:59';
  }

  return params;
};

export default function Calendar() {
  const [activities, setActivities] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [calendarFilter, setCalendarFilter] = useState(null);

  const { canCreateContent, currentHost, currentUser, role } =
    useContext(StateContext);
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const [tc] = useTranslation('common');

  const activitiesParsed = useMemo(
    () => parseAllBookingsWithResources(activities, resources),
    [activities, resources]
  );

  const getData = async () => {
    const isPortalHost = Boolean(currentHost?.isPortalHost);
    try {
      const activitiesResponse = isPortalHost
        ? await call('getAllActivitiesFromAllHosts')
        : await call('getAllActivities');
      const resourcesResponse = isPortalHost
        ? await call('getResourcesFromAllHosts')
        : await call('getResources');
      setActivities(activitiesResponse);
      setResources(resourcesResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSelectActivity = (activity, e) => {
    e.preventDefault();
    setSelectedActivity(activity);
  };

  const handleSelectSlot = (slotInfo) => {
    if (!canCreateContent || !slotInfo) {
      return;
    }

    const selectedResource = resources.find(
      (resource) =>
        calendarFilter && resource._id === calendarFilter._id
    );

    let type = 'other';

    if (slotInfo?.slots?.length === 1) {
      // One day selected in month view
      type = 'month-oneday';
    } else if (
      // Multiple days selected in month view
      slotInfo?.slots?.length > 1 &&
      dayjs(slotInfo?.end).format('HH:mm') === '00:00'
    ) {
      type = 'month-multipledays';
    }

    const dateParams = parseNewEntryParams(
      slotInfo,
      selectedResource,
      type
    );

    setSearchParams((params) => ({
      ...params,
      ...dateParams,
      new: true,
    }));
  };

  const getActivityTimes = (activity) => {
    if (!activity) {
      return '';
    }
    if (activity.startDate === activity.endDate) {
      return `${activity.startTime}–${activity.endTime} ${dayjs(
        activity.startDate
      ).format('DD MMMM')}`;
    }
    return `${dayjs(activity.startDate).format('DD MMM')} ${
      activity.startTime
    } – ${dayjs(activity.endDate).format('DD MMM')} ${
      activity.endTime
    }`;
  };

  const isCreatorOrAdmin = () =>
    (selectedActivity &&
      currentUser &&
      currentUser.username === selectedActivity.authorName) ||
    role === 'admin';

  const handlePrimaryButtonClick = () => {
    const isSameHost = selectedActivity.host === currentHost.host;

    if (selectedActivity.isGroupMeeting) {
      if (isSameHost) {
        navigate(`/groups/${selectedActivity.groupId}/info`);
        return;
      }
      window.location.href = `https://${selectedActivity.host}/groups/${selectedActivity.groupId}/info`;
      return;
    }

    const listing = selectedActivity.isPublicActivity
      ? 'activities'
      : 'calendar';
    if (isSameHost) {
      navigate(`/${listing}/${selectedActivity.activityId}/info`);
      return;
    }
    window.location.href = `https://${selectedActivity.host}/${listing}/${selectedActivity.activityId}/info`;
  };

  const handleSecondaryButtonClick = () => {
    if (!isCreatorOrAdmin()) {
      setSelectedActivity(null);
      return;
    }

    if (selectedActivity.isGroupMeeting) {
      navigate(`/groups/${selectedActivity.groupId}/info`);
    } else {
      navigate(`/calendar/${selectedActivity.activityId}?edit=true`);
    }
  };

  const filteredActivities = activitiesParsed.filter(
    (activity) =>
      !calendarFilter ||
      calendarFilter._id === activity.resourceId ||
      calendarFilter._id === activity.comboResourceId
  );

  const nonComboResources = resources.filter(
    (resource) => !resource.isCombo
  );
  const nonComboResourcesWithColor =
    getNonComboResourcesWithColor(nonComboResources);

  const comboResources = resources.filter(
    (resource) => resource.isCombo
  );
  const comboResourcesWithColor = getComboResourcesWithColor(
    comboResources,
    nonComboResourcesWithColor
  );

  const allFilteredActsWithColors = filteredActivities.map((act) => {
    const resource = nonComboResourcesWithColor.find(
      (res) => res._id === act.resourceId
    );
    const resourceColor = (resource && resource.color) || '#484848';

    return {
      ...act,
      resourceColor,
    };
  });

  const selectFilterView =
    nonComboResourcesWithColor.filter((r) => r.isBookable)?.length >=
    maxResourceLabelsToShow;

  const allResourcesForSelect = [
    ...comboResourcesWithColor,
    ...nonComboResourcesWithColor,
  ].filter((r) => r.isBookable);

  if (!currentHost) {
    return null;
  }

  const { settings } = currentHost;
  const calendarInMenu = settings?.menu.find(
    (item) => item.name === 'calendar'
  );
  const heading = calendarInMenu?.label;
  const description = calendarInMenu?.description;
  const url = `${currentHost?.host}/${calendarInMenu?.name}`;

  return (
    <Box>
      <PageHeading
        description={description}
        heading={heading}
        imageUrl={currentHost.logo}
        url={url}
      />

      <Box>
        <Center mb="2">
          {!selectFilterView ? (
            <Box>
              <Wrap justify="center" px="1" pb="1" mb="3">
                <WrapItem>
                  <Tag
                    alignSelf="center"
                    checkable
                    key="All"
                    label={tc('labels.all')}
                    filterColor="#484848"
                    checked={!calendarFilter}
                    onClick={() => setCalendarFilter(null)}
                  />
                </WrapItem>

                {nonComboResourcesWithColor
                  .filter((r) => r.isBookable)
                  .map((resource) => (
                    <WrapItem key={resource._id}>
                      <Tag
                        checkable
                        label={resource.label}
                        filterColor={resource.color}
                        checked={calendarFilter?._id === resource._id}
                        onClick={() => setCalendarFilter(resource)}
                      />
                    </WrapItem>
                  ))}
              </Wrap>
              <Wrap justify="center" mb="2" px="1">
                {comboResourcesWithColor
                  .filter((r) => r.isBookable)
                  .map((resource) => (
                    <WrapItem key={resource._id}>
                      <Tag
                        checkable
                        label={resource.label}
                        filterColor={'#2d2d2d'}
                        gradientBackground={resource.color}
                        checked={calendarFilter?._id === resource._id}
                        onClick={() => setCalendarFilter(resource)}
                      />
                    </WrapItem>
                  ))}
              </Wrap>
            </Box>
          ) : (
            <Flex w="30rem" align="center">
              <Button
                colorScheme="green"
                mr="2"
                size="sm"
                variant={calendarFilter ? 'outline' : 'solid'}
                onClick={() => setCalendarFilter(null)}
              >
                {tc('labels.all')}
              </Button>

              <Box w="100%">
                <AutoCompleteSelect
                  isClearable
                  onChange={(value) => setCalendarFilter(value)}
                  components={animatedComponents}
                  value={calendarFilter}
                  options={allResourcesForSelect}
                  getOptionValue={(option) => option._id}
                  style={{ width: '100%', marginTop: '1rem' }}
                  styles={{
                    option: (styles, { data }) => ({
                      ...styles,
                      borderLeft: `8px solid ${data.color}`,
                      // background: data.color.replace('40%', '90%'),
                      paddingLeft: !data.isCombo && 6,
                      fontWeight: data.isCombo ? 'bold' : 'normal',
                    }),
                  }}
                />
              </Box>
            </Flex>
          )}
        </Center>

        <Box mb="4">
          <CalendarView
            activities={allFilteredActsWithColors}
            resources={resources}
            onSelect={handleSelectActivity}
            onSelectSlot={handleSelectSlot}
          />
        </Box>
      </Box>

      <Modal
        open={Boolean(selectedActivity)}
        title={selectedActivity && selectedActivity.title}
        confirmText={tc('actions.entryPage')}
        cancelText={
          isCreatorOrAdmin()
            ? tc('actions.update')
            : tc('actions.close')
        }
        onClose={() => setSelectedActivity(null)}
        onConfirm={() => handlePrimaryButtonClick()}
        onCancel={() => handleSecondaryButtonClick()}
      >
        <Box
          bg="brand.50"
          style={{ fontFamily: 'Courier, monospace' }}
          p="2"
          my="1"
        >
          <div>
            <Link to={`/@${selectedActivity?.authorName}`}>
              <CLink as="span" fontWeight="bold">
                {selectedActivity && selectedActivity.authorName}
              </CLink>{' '}
            </Link>
            <Text as="span">{tc('labels.booked')}</Text>{' '}
            <Link to={`/resources/${selectedActivity?.resourceId}`}>
              <CLink as="span" fontWeight="bold">
                {selectedActivity && selectedActivity.resource}
              </CLink>
            </Link>
          </div>
          <Text>{getActivityTimes(selectedActivity)}</Text>
        </Box>

        <Text fontSize="sm" mt="2" p="1">
          {selectedActivity?.longDescription &&
            (selectedActivity?.isGroupPrivate
              ? ''
              : parseHtml(selectedActivity?.longDescription))}
        </Text>

        {/* {!selectedActivity?.isGroupPrivate && (
            <Center>
              <Link to={selectedLinkForModal}>
                <Button size="sm" as="span" rightIcon={<ArrowForwardIcon />} variant="ghost">
                  {' '}
                  {tc('actions.entryPage')}
                </Button>
              </Link>
            </Center>
          )} */}
      </Modal>
    </Box>
  );
}
