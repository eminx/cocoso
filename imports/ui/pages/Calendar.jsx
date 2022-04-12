import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import i18n from 'i18next';

import {
  Box,
  Button,
  Center,
  Tag as CTag,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import renderHTML from 'react-render-html';
import { Helmet } from 'react-helmet';
import { stringify } from 'query-string';
import AutoCompleteSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import Loader from '../components/Loader';
import CalendarView from '../components/CalendarView';
import ConfirmModal from '../components/ConfirmModal';
import Tag from '../components/Tag';
import { getHslValuesFromLength } from '../@/constants/colors';
import { call } from '../@/shared';
import { message } from '../components/message';
import { StateContext } from '../LayoutContainer';

moment.locale(i18n.language);
const animatedComponents = makeAnimated();
const publicSettings = Meteor.settings.public;
const maxResourceLabelsToShow = 12;

class Calendar extends PureComponent {
  state = {
    calendarFilter: 'All',
    editActivity: null,
    resourcesList: [],
    selectedActivity: null,
    selectedSlot: null,
    mode: 'list',
    selectedResource: null,
  };

  componentDidMount() {
    this.getResources();
  }

  getResources = async () => {
    try {
      const resourcesList = await call('getResources');
      this.setState({ resourcesList });
    } catch (error) {
      message.error(error.error || error.reason);
    }
  };

  handleModeChange = (e) => {
    const mode = e.target.value;
    this.setState({ mode });
  };

  handleSelectActivity = (activity, e) => {
    e.preventDefault();
    this.setState({
      selectedActivity: activity,
    });
  };

  handleCalendarFilterChange = (value) => {
    this.setState({ calendarFilter: value });
    if (value == 'All') this.setState({ selectedResource: null });
  };

  handleAutoCompleteSelectChange = (newValue, actionMeta) => {
    this.setState({ selectedResource: newValue });
    if (newValue === null) this.handleCalendarFilterChange('All');
    else this.handleCalendarFilterChange(newValue?._id);
  };

  handleCloseModal = () => {
    this.setState({
      selectedActivity: null,
    });
  };

  handleEditActivity = () => {
    this.setState({
      editActivity: true,
    });
  };

  handleSelectSlot = (slotInfo) => {
    const { canCreateContent } = this.context;

    if (!canCreateContent) {
      return;
    }

    const { resourcesList, calendarFilter } = this.state;

    const selectedResource = resourcesList.find(
      (resource) => resource._id === calendarFilter
    );

    if (slotInfo?.slots?.length === 1) {
      // One day selected in month view
      const type = 'month-oneday';
      this.setState({
        selectedSlot: {
          ...slotInfo,
          type,
          content: moment(slotInfo?.start).format('DD MMMM'),
          bookingUrl: parseDatesForQuery(slotInfo, selectedResource, type),
        },
      });
    } else if (
      // Multiple days selected in month view
      slotInfo?.slots?.length > 1 &&
      moment(slotInfo?.end).format('HH:mm') === '00:00'
    ) {
      const type = 'month-multipledays';
      this.setState({
        selectedSlot: {
          ...slotInfo,
          type,
          content:
            moment(slotInfo?.start).format('DD MMMM') +
            ' – ' +
            moment(slotInfo?.end).add(-1, 'days').format('DD MMMM'),
          bookingUrl: parseDatesForQuery(slotInfo, selectedResource, type),
        },
      });
    } else {
      // All other, i.e. weekly, daily bookings
      const type = 'other';
      this.setState({
        selectedSlot: {
          ...slotInfo,
          type,
          content:
            moment(slotInfo?.start).format('DD MMMM') +
            ': ' +
            moment(slotInfo?.start).format('HH:mm') +
            ' – ' +
            moment(slotInfo?.end).format('HH:mm'),
          bookingUrl: parseDatesForQuery(slotInfo, selectedResource, type),
        },
      });
    }
  };

  activateRedirectToBooking = () => {
    this.setState(({ selectedSlot }) => ({
      selectedSlot: {
        ...selectedSlot,
        isRedirectActive: true,
      },
    }));
  };

  handleCloseSelectedSlot = () => {
    this.setState({ selectedSlot: null });
  };

  getActivityTimes = (activity) => {
    if (!activity) {
      return '';
    }
    if (activity.startDate === activity.endDate) {
      return `${activity.startTime}–${activity.endTime} ${moment(
        activity.startDate
      ).format('DD MMMM')}`;
    }
    return (
      moment(activity.startDate).format('DD MMM') +
      ' ' +
      activity.startTime +
      ' – ' +
      moment(activity.endDate).format('DD MMM') +
      ' ' +
      activity.endTime
    );
  };

  isCreator = () => {
    const { currentUser } = this.props;
    const { selectedActivity } = this.state;

    if (!selectedActivity || !currentUser) {
      return false;
    }

    if (
      selectedActivity &&
      currentUser &&
      currentUser.username === selectedActivity.authorName
    ) {
      return true;
    }
  };

  render() {
    const { isLoading, currentUser, allActivities, tc } = this.props;
    const { canCreateContent, currentHost, role } = this.context;
    const {
      editActivity,
      calendarFilter,
      selectedActivity,
      selectedSlot,
      isUploading,
      resourcesList,
      selectedResource,
    } = this.state;

    const filteredActivities = allActivities.filter((activity) => {
      return (
        calendarFilter === 'All' || activity.resourceId === calendarFilter
        // activity.comboResource === calendarFilter
      );
    });

    if (editActivity) {
      return <Redirect to={`/edit-activity/${selectedActivity._id}`} />;
    }

    const nonComboResources = resourcesList.filter(
      (resource) => !resource.isCombo
    );

    const hslValues = getHslValuesFromLength(nonComboResources.length);
    const nonComboResourcesWithColor = nonComboResources.map((res, i) => ({
      ...res,
      color: hslValues[i],
    }));

    const comboResources = resourcesList.filter((resource) => resource.isCombo);
    const comboResourcesWithColor = comboResources.map((res, i) => {
      const colors = [];
      res.resourcesForCombo.forEach((resCo, i) => {
        const resWithColor = nonComboResourcesWithColor.find(
          (nRes) => resCo.label === nRes.label
        );
        if (!resWithColor) {
          return;
        }
        colors.push(resWithColor.color);
      });
      let color = 'linear-gradient(to right, ';
      colors.forEach((c, i) => {
        color += c;
        if (i < colors.length - 1) {
          color += ', ';
        } else {
          color += ')';
        }
      });
      const comboLabel = `${res.label} [${res.resourcesForCombo
        .map((item) => item.label)
        .join(',')}]`;
      return { ...res, color, label: comboLabel };
    });

    const allFilteredActsWithColors = filteredActivities.map((act, i) => {
      const resource = nonComboResourcesWithColor.find(
        (res) => res._id === act.resourceId
      );
      const resourceColor = (resource && resource.color) || '#484848';

      return {
        ...act,
        resourceColor,
      };
    });

    if (selectedSlot?.bookingUrl && selectedSlot?.isRedirectActive) {
      return <Redirect to={selectedSlot.bookingUrl} />;
    }

    return (
      <Box>
        <Helmet>
          <title>{`${tc('domains.activity')} ${tc('domains.calendar')} | ${
            currentHost.settings.name
          } | ${publicSettings.name}`}</title>
        </Helmet>
        {currentUser && canCreateContent && (
          <Center mb="3">
            <Link to="/new-activity">
              <Button
                as="span"
                colorScheme="green"
                variant="outline"
                textTransform="uppercase"
              >
                {tc('actions.create')}
              </Button>
            </Link>
          </Center>
        )}

        <Box bg="white" pt="1" mb="3">
          <Center p="2">
            <Wrap justify="center" px="1" pb="1">
              <WrapItem>
                <Tag
                  alignSelf="center"
                  checkable
                  key="All"
                  label={tc('labels.all')}
                  filterColor="#484848"
                  checked={calendarFilter === 'All'}
                  onClick={() => this.handleCalendarFilterChange('All')}
                />
              </WrapItem>
              {nonComboResourcesWithColor.length < maxResourceLabelsToShow &&
                nonComboResourcesWithColor.map((resource, i) => (
                  <WrapItem key={resource._id}>
                    <Tag
                      checkable
                      label={resource.label}
                      filterColor={resource.color}
                      checked={calendarFilter === resource._id}
                      onClick={() =>
                        this.handleCalendarFilterChange(resource._id)
                      }
                    />
                  </WrapItem>
                ))}
            </Wrap>
            {nonComboResourcesWithColor.length >= maxResourceLabelsToShow && (
              <Box w="30rem" zIndex={11}>
                <AutoCompleteSelect
                  isClearable
                  onChange={this.handleAutoCompleteSelectChange}
                  components={animatedComponents}
                  value={selectedResource}
                  options={[
                    ...nonComboResourcesWithColor,
                    ...comboResourcesWithColor,
                  ].map((item) => ({
                    ...item,
                    value: item._id,
                  }))}
                  style={{ width: '100%', marginTop: '1rem' }}
                  styles={{
                    option: (styles, { data }) => ({
                      ...styles,
                      color: data.color,
                    }),
                    singleValue: (styles, { data }) => ({
                      ...styles,
                      color: data.color,
                    }),
                  }}
                />
              </Box>
            )}
          </Center>
          <Center>
            <Wrap justify="center" mb="2" px="1">
              {nonComboResourcesWithColor.length < maxResourceLabelsToShow &&
                comboResourcesWithColor.map((resource, i) => (
                  <WrapItem key={resource._id}>
                    <Tag
                      checkable
                      label={resource.label}
                      filterColor={'#2d2d2d'}
                      gradientBackground={resource.color}
                      checked={calendarFilter === resource._id}
                      onClick={() =>
                        this.handleCalendarFilterChange(resource._id)
                      }
                    />
                  </WrapItem>
                ))}
            </Wrap>
          </Center>

          {isLoading ? (
            <Loader />
          ) : (
            <Box>
              <CalendarView
                activities={allFilteredActsWithColors}
                onSelect={this.handleSelectActivity}
                onSelectSlot={this.handleSelectSlot}
              />
            </Box>
          )}
        </Box>

        <ConfirmModal
          visible={Boolean(selectedActivity)}
          title={selectedActivity && selectedActivity.title}
          confirmText={tc('actions.update')}
          cancelText={tc('actions.close')}
          onConfirm={this.handleEditActivity}
          onCancel={this.handleCloseModal}
          confirmButtonProps={
            (!this.isCreator() || selectedActivity.isProcess) && {
              style: { display: 'none' },
            }
          }
          onClickOutside={this.handleCloseModal}
        >
          <Box
            bg="light-1"
            style={{ fontFamily: 'Courier, monospace' }}
            p="1"
            my="1"
          >
            <div>
              <Text as="span" fontWeight="bold">
                {selectedActivity && selectedActivity.authorName}
              </Text>{' '}
              <Text as="span">{tc('labels.booked')}</Text>{' '}
              <Text as="span" fontWeight="bold">
                {selectedActivity && selectedActivity.resource}
              </Text>
            </div>
            <Text>{this.getActivityTimes(selectedActivity)}</Text>
          </Box>

          <Text fontSize="sm">
            <div className="text-content">
              {selectedActivity &&
                selectedActivity.longDescription &&
                (selectedActivity.isPrivateProcess
                  ? ''
                  : renderHTML(
                      selectedActivity.longDescription.slice(0, 120) + '...'
                    ))}
            </div>
          </Text>

          <Center>
            {selectedActivity && selectedActivity.isPublicActivity && (
              <Link
                to={
                  (selectedActivity.isProcess ? '/process/' : '/event/') +
                  selectedActivity._id
                }
              >
                <Button
                  as="span"
                  my="2"
                  rightIcon={<ArrowForwardIcon />}
                  variant="ghost"
                >
                  {' '}
                  {!selectedActivity.isPrivateProcess &&
                    `${
                      selectedActivity.isProcess
                        ? tc('labels.process')
                        : tc('labels.event')
                    } ${tc('labels.page')}`}
                </Button>
              </Link>
            )}
          </Center>
        </ConfirmModal>

        <ConfirmModal
          visible={Boolean(selectedSlot)}
          title={tc('labels.newBooking') + '?'}
          confirmText={
            <span>
              {tc('actions.create')} <ArrowForwardIcon />
            </span>
          }
          cancelText={tc('actions.close')}
          onConfirm={this.activateRedirectToBooking}
          onCancel={this.handleCloseSelectedSlot}
          onClickOutside={this.handleCloseSelectedSlot}
        >
          <Box bg="light-1" p="1" my="1">
            <Box>
              <CTag mr="2">
                <TagLabel>
                  {calendarFilter === 'All'
                    ? tc('labels.unselected')
                    : calendarFilter}
                </TagLabel>
              </CTag>
              <Text as="span" fontWeight="bold">
                {selectedSlot?.content}
              </Text>
            </Box>
          </Box>
        </ConfirmModal>
      </Box>
    );
  }
}

function parseDatesForQuery(slotInfo, selectedResource, type) {
  let bookingUrl = '/new-activity/?';
  const params = {
    startDate: moment(slotInfo?.start).format('YYYY-MM-DD'),
    endDate: moment(slotInfo?.end).format('YYYY-MM-DD'),
    startTime: moment(slotInfo?.start).format('HH:mm'),
    endTime: moment(slotInfo?.end).format('HH:mm'),
    resource: selectedResource ? selectedResource._id : '',
  };

  if (type !== 'other') {
    params.endDate = moment(slotInfo?.end).add(-1, 'days').format('YYYY-MM-DD');
    params.endTime = '23:59';
  }

  bookingUrl += stringify(params);
  return bookingUrl;
}

Calendar.contextType = StateContext;

export default Calendar;
