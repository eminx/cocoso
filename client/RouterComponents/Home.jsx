import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReactDropzone from 'react-dropzone';
import { Row, Col, Divider, List, Card } from 'antd/lib';
import Loader from '../UIComponents/Loader';
import PublicActivityThumb from '../UIComponents/PublicActivityThumb';

const ListItem = List.Item;

const yesterday = moment(new Date()).add(-1, 'days');

const getFirstFutureOccurence = occurence =>
  moment(occurence.endDate).isAfter(yesterday);

const compareForSort = (a, b) => {
  const firstOccurenceA = a.datesAndTimes.find(getFirstFutureOccurence);
  const firstOccurenceB = b.datesAndTimes.find(getFirstFutureOccurence);
  const dateA = new Date(
    firstOccurenceA.startDate + 'T' + firstOccurenceA.startTime + ':00Z'
  );
  const dateB = new Date(
    firstOccurenceB.startDate + 'T' + firstOccurenceB.startTime + ':00Z'
  );
  return dateA - dateB;
};

class Home extends React.Component {
  state = {
    isUploading: false
  };

  getPublicActivities = () => {
    const { bookingsList } = this.props;
    if (!bookingsList) {
      return null;
    }

    const publicActivities = bookingsList.filter(
      activity => activity.isPublicActivity === true
    );

    const futurePublicActivities = publicActivities.filter(activity =>
      activity.datesAndTimes.some(date =>
        moment(date.endDate).isAfter(yesterday)
      )
    );

    return futurePublicActivities;
  };

  getGroupMeetings = () => {
    const { groupsList } = this.props;
    if (!groupsList) {
      return null;
    }

    const futureGroups = groupsList.filter(group =>
      group.meetings.some(meeting =>
        moment(meeting.startDate).isAfter(yesterday)
      )
    );

    return futureGroups.map(group => ({
      ...group,
      datesAndTimes: group.meetings,
      isGroup: true
    }));
  };

  getAllSorted = () => {
    const allActitivities = [
      ...this.getPublicActivities(),
      ...this.getGroupMeetings()
    ];
    return allActitivities.sort(compareForSort);
  };

  handleDropDocument = files => {
    const { currentUser } = this.props;
    if (files.length > 1) {
      message.error('Please drop only one file at a time.');
      return;
    }

    this.setState({ isUploading: true });

    const closeLoader = () => this.setState({ isUploading: false });

    const upload = new Slingshot.Upload('groupDocumentUpload');
    files.forEach(file => {
      const parsedName = file.name.replace(/\s+/g, '-').toLowerCase();
      const uploadableFile = new File([file], parsedName, {
        type: file.type
      });
      console.log('uploadableFile:', uploadableFile);
      upload.send(uploadableFile, (error, downloadUrl) => {
        console.log(uploadableFile);
        if (error) {
          console.error('Error uploading:', error);
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
                console.log(error);
                closeLoader();
              }
            }
          );
        }
      });
    });
  };

  render() {
    const { isLoading, currentUser, manuals } = this.props;
    const { isUploading } = this.state;

    const allSortedActivities = this.getAllSorted();

    const isSuperAdmin = currentUser && currentUser.isSuperAdmin;

    return (
      <div style={{ padding: 24 }}>
        <Row gutter={24}>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              marginBottom: 50
            }}
          >
            <div style={{ width: '100%' }}>
              {isLoading ? (
                <Loader />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}
                >
                  {allSortedActivities.map(activity => (
                    <PublicActivityThumb key={activity.title} item={activity} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Row>

        <Divider />

        <Row>
          <h3 style={{ textAlign: 'center' }}>Manuals</h3>
          <Col md={8}>
            {isSuperAdmin && (
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
                  </div>
                )}
              </ReactDropzone>
            )}
          </Col>
          <Col md={16} style={{ paddingLeft: 12, paddingRight: 12 }}>
            {manuals && manuals.length > 0 && (
              <List
                dataSource={manuals}
                renderItem={manual => (
                  <ListItem style={{ paddingBottom: 0 }}>
                    <Card
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
                  </ListItem>
                )}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
