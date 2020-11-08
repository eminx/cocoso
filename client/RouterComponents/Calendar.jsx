import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import { Box, Button, Heading, Text } from 'grommet';
import { FormAdd } from 'grommet-icons';
import renderHTML from 'react-render-html';

import Loader from '../UIComponents/Loader';
import CalendarView from '../UIComponents/CalendarView';
import ConfirmModal from '../UIComponents/ConfirmModal';
import { SimpleTag, message } from '../UIComponents/message';
import colors from '../constants/colors';
import { StateContext } from '../LayoutContainer';

const yesterday = moment(new Date()).add(-1, 'days');

class Calendar extends React.PureComponent {
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
    const { canCreateContent, role } = this.context;
    const {
      editActivity,
      calendarFilter,
      selectedActivity,
      isUploading,
    } = this.state;

    const futureActivities = [];

    allActivities.filter((activity) => {
      if (moment(activity.endDate).isAfter(yesterday)) {
        futureActivities.push(activity);
      }
    });

    let filteredActivities = allActivities;

    if (calendarFilter !== 'All') {
      filteredActivities = allActivities.filter(
        (activity) => activity.resource === calendarFilter
      );
    }

    if (editActivity) {
      return <Redirect to={`/edit-activity/${selectedActivity._id}`} />;
    }

    return (
      <Box>
        <Box alignSelf="center">
          <Heading level={2} textAlign="center">
            Calendar
          </Heading>
        </Box>

        {currentUser && canCreateContent && (
          <Box
            direction="row"
            justify="center"
            width="100%"
            margin={{ bottom: 'small' }}
          >
            <Link to="/new-activity">
              <Button
                as="span"
                size="small"
                label="NEW"
                primary
                icon={<FormAdd />}
              />
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
            <SimpleTag
              checked={calendarFilter === 'All'}
              onClick={() => this.handleCalendarFilterChange('All')}
              key={'All'}
            >
              {'All'}
            </SimpleTag>
            {resourcesList.map((resource, i) => (
              <SimpleTag
                color={colors[i]}
                checked={calendarFilter === resource.label}
                onClick={() => this.handleCalendarFilterChange(resource.label)}
                key={resource.label}
              >
                {resource.label}
              </SimpleTag>
            ))}
          </Box>

          {isLoading ? (
            <Loader />
          ) : (
            <Box>
              <CalendarView
                activities={filteredActivities}
                onSelect={this.handleSelectActivity}
              />
            </Box>
          )}
        </Box>

        {/* <Divider />

        <Row>
          <h3 style={{ textAlign: 'center' }}>Manuals</h3>
          <Col md={8}>
            {role === 'admin' && (
              <ReactDropzone onDrop={this.handleDropDocument}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div
                    {...getRootProps()}
                    style={{
                      width: '100%',
                      height: 200,
                      background: isDragActive ? '#ea3924' : '#fff5f4cc',
                      padding: 24,
                      border: '1px dashed #ea3924',
                      textAlign: 'center'
                    }}
                  >
                    {isUploading ? (
                      <div>
                        <Loader />
                        uploading
                      </div>
                    ) : (
                      <div>
                        <b>Drop documents to upload</b>
                      </div>
                    )}
                    <input {...getInputProps()} />
                  </div>
                )}
              </ReactDropzone>
            )}
          </Col>
          <Col md={16} style={{ paddingLeft: 12, paddingRight: 12 }}>
            {manuals && manuals.length > 0 && (
              <NiceList list={manualsList} >
                {manual => (
                  <Card
                    key={manual.documentLabel}
                    title={
                      <h4>
                        <a href={manual.documentUrl} target="_blank">
                          {manual.documentLabel}
                        </a>
                      </h4>
                    }
                    bordered={false}
                    style={{ width: '100%', marginBottom: 0 }}
                    className="empty-card-body"
                  />
                )}
              </NiceList>
            )}
          </Col>
        </Row> */}

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
            <div>
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
