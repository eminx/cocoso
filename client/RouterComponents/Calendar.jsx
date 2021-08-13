import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import { Box, Button, Heading, Text } from 'grommet';
import renderHTML from 'react-render-html';
import { Helmet } from 'react-helmet';

import Loader from '../UIComponents/Loader';
import CalendarView from '../UIComponents/CalendarView';
import ConfirmModal from '../UIComponents/ConfirmModal';
import { SimpleTag, message } from '../UIComponents/message';
import Tag from '../UIComponents/Tag';
import colors, { getHslValuesFromLength } from '../constants/colors';
import { StateContext } from '../LayoutContainer';

const publicSettings = Meteor.settings.public;
const yesterday = moment(new Date()).add(-1, 'days');

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

  handleDropDocument = (files) => {
    const { currentUser } = this.props;
    const { role } = this.context;
    if (!currentUser || role !== 'admin') {
      return;
    }

    if (files.length > 1) {
      message.error('Please drop only one file at a time.');
      return;
    }

    this.setState({ isUploading: true });

    const closeLoader = () => this.setState({ isUploading: false });

    const upload = new Slingshot.Upload('processDocumentUpload');
    files.forEach((file) => {
      const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();
      const uploadableFile = new File([file], parsedName, {
        type: file.type,
      });
      upload.send(uploadableFile, (error, downloadUrl) => {
        if (error) {
          message.error(error.reason);
          closeLoader();
          return;
        } else {
          Meteor.call(
            'createDocument',
            uploadableFile.name,
            downloadUrl,
            'manual',
            currentUser.username,
            (error, respond) => {
              if (error) {
                message.error(error);
                closeLoader();
              } else {
                message.success(
                  `${uploadableFile.name} is succesfully uploaded and assigned to manuals!`
                );
                closeLoader();
              }
            }
          );
        }
      });
    });
  };

  removeManual = (documentId) => {
    const { currentUser } = this.props;
    const { role } = this.context;
    if (!currentUser || role !== 'admin') {
      return;
    }
    Meteor.call('removeManual', documentId, (error, respond) => {
      if (error) {
        console.log('error', error);
        message.destroy();
        message.error(error.error);
      } else {
        message.success('The manual is successfully removed');
      }
    });
  };

  render() {
    const { isLoading, currentUser, resourcesList, allActivities } = this.props;
    const { canCreateContent, currentHost, role } = this.context;
    const { editActivity, calendarFilter, selectedActivity, isUploading } =
      this.state;

    const futureActivities = [];

    allActivities.filter((activity) => {
      if (moment(activity.endDate).isAfter(yesterday)) {
        futureActivities.push(activity);
      }
    });

    const filteredActivities = allActivities.filter((activity) => {
      return calendarFilter === 'All' || activity.resource === calendarFilter;
    });

    if (editActivity) {
      return <Redirect to={`/edit-activity/${selectedActivity._id}`} />;
    }

    const nonComboResources = resourcesList.filter(
      (resource) => !resource.isCombo
    );
    const comboResources = resourcesList.filter((resource) => resource.isCombo);

    const hslValues = getHslValuesFromLength(nonComboResources.length);
    const nonComboResourcesWithColor = nonComboResources.map((res, i) => ({
      ...res,
      color: hslValues[i],
    }));

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
          <Box
            direction="row"
            justify="center"
            width="100%"
            margin={{ bottom: 'small' }}
          >
            <Link to="/new-activity">
              <Button as="span" size="small" label="NEW" />
            </Link>
          </Box>
        )}

        <Box
          background="white"
          pad={{ top: 'small' }}
          margin={{ bottom: 'large' }}
        >
          <Box
            direction="row"
            justify="center"
            align="center"
            gap="small"
            className="tags-container"
            width="100%"
            pad="small"
            wrap
          >
            <Tag
              checkable
              key="All"
              label="All"
              filterColor="#484848"
              checked={calendarFilter === 'All'}
              onClick={() => this.handleCalendarFilterChange('All')}
            />
            {nonComboResources.map((resource, i) => (
              <Tag
                checkable
                key={resource.label}
                label={resource.label}
                filterColor={hslValues[i]}
                checked={calendarFilter === resource.label}
                onClick={() => this.handleCalendarFilterChange(resource.label)}
              />
            ))}
          </Box>

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
            style={{ fontFamily: 'Courier, monospace' }}
            background="light-1"
            pad="small"
            margin={{ top: 'small', bottom: 'small' }}
          >
            <div>
              <Text weight="bold">
                {selectedActivity && selectedActivity.authorName}
              </Text>{' '}
              <Text>booked</Text>{' '}
              <Text weight="bold">
                {selectedActivity && selectedActivity.resource}
              </Text>
            </div>
            <Text>{this.getActivityTimes(selectedActivity)}</Text>
          </Box>

          <Text size="small">
            <div className="text-content">
              {selectedActivity &&
                selectedActivity.longDescription &&
                (selectedActivity.isPrivateProcess
                  ? ''
                  : renderHTML(
                      selectedActivity.longDescription.slice(0, 120) + '...'
                    ))}
            </div>
            {selectedActivity && selectedActivity.isPublicActivity && (
              <Link
                to={
                  (selectedActivity.isProcess ? '/process/' : '/event/') +
                  selectedActivity._id
                }
              >
                {' '}
                {!selectedActivity.isPrivateProcess &&
                  `go to the ${
                    selectedActivity.isProcess ? 'process ' : 'event '
                  }
                    page`}
              </Link>
            )}
          </Text>
        </ConfirmModal>
      </Box>
    );
  }
}

Calendar.contextType = StateContext;

export default Calendar;
