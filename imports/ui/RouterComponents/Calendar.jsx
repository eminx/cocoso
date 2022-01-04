import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';

import { Box, Button, Center, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import renderHTML from 'react-render-html';
import { Helmet } from 'react-helmet';

import Loader from '../UIComponents/Loader';
import CalendarView from '../UIComponents/CalendarView';
import ConfirmModal from '../UIComponents/ConfirmModal';
import Tag from '../UIComponents/Tag';
import { getHslValuesFromLength } from '../constants/colors';
import { StateContext } from '../LayoutContainer';

const publicSettings = Meteor.settings.public;

class Calendar extends PureComponent {
  state = {
    mode: 'list',
    editActivity: null,
    calendarFilter: 'All',
    selectedActivity: null,
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
    this.setState({
      calendarFilter: value,
    });
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
    const { isLoading, currentUser, resourcesList, allActivities } = this.props;
    const { canCreateContent, currentHost, role } = this.context;
    const { editActivity, calendarFilter, selectedActivity, isUploading } =
      this.state;

    const filteredActivities = allActivities.filter((activity) => {
      return (
        calendarFilter === 'All' ||
        activity.resource === calendarFilter ||
        activity.comboResource === calendarFilter
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
      return { ...res, color };
    });

    const allFilteredActsWithColors = filteredActivities.map((act, i) => {
      const resource = nonComboResourcesWithColor.find(
        (res) => res.label === act.resource
      );
      const resourceColor = (resource && resource.color) || '#484848';

      return {
        ...act,
        resourceColor,
      };
    });

    return (
      <Box>
        <Helmet>
          <title>{`Activity Calendar | ${currentHost.settings.name} | ${publicSettings.name}`}</title>
        </Helmet>
        {currentUser && canCreateContent && (
          <Center mb="3">
            <Link to="/new-activity">
              <Button as="span" colorScheme="green" variant="outline">
                NEW
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
                  label="All"
                  filterColor="#484848"
                  checked={calendarFilter === 'All'}
                  onClick={() => this.handleCalendarFilterChange('All')}
                />
              </WrapItem>
              {nonComboResourcesWithColor.map((resource, i) => (
                <WrapItem key={resource.label}>
                  <Tag
                    checkable
                    label={resource.label}
                    filterColor={resource.color}
                    checked={calendarFilter === resource.label}
                    onClick={() =>
                      this.handleCalendarFilterChange(resource.label)
                    }
                  />
                </WrapItem>
              ))}
            </Wrap>
          </Center>

          <Center>
            <Wrap justify="center" mb="2" px="1">
              {comboResourcesWithColor.map((resource, i) => (
                <WrapItem key={resource.label}>
                  <Tag
                    checkable
                    label={resource.label}
                    filterColor={'#2d2d2d'}
                    gradientBackground={resource.color}
                    checked={calendarFilter === resource.label}
                    onClick={() =>
                      this.handleCalendarFilterChange(resource.label)
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
              />
            </Box>
          )}
        </Box>

        <ConfirmModal
          visible={Boolean(selectedActivity)}
          title={selectedActivity && selectedActivity.title}
          confirmText="Edit"
          cancelText="Close"
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
              <Text as="span">booked</Text>{' '}
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
                    `${selectedActivity.isProcess ? 'Process ' : 'Event '}
                    Page`}
                </Button>
              </Link>
            )}
          </Center>
        </ConfirmModal>
      </Box>
    );
  }
}

Calendar.contextType = StateContext;

export default Calendar;
