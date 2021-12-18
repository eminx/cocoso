import { withTracker } from 'meteor/react-meteor-data';
import Calendar from './Calendar';
import moment from 'moment';

import { parseActsWithResources } from '../functions';

import Documents from '../../api/documents/document';

const CalendarContainer = withTracker((props) => {
  const activities = Meteor.subscribe('activities');
  const isLoading = !activities.ready();
  const activitiesList = Activities ? Activities.find().fetch() : null;
  const currentUser = Meteor.user();
  const resourcesSub = Meteor.subscribe('resources');
  const resourcesList = Resources ? Resources.find().fetch() : null;
  const processesSubscription = Meteor.subscribe('processes');
  const processesList = Processes ? Processes.find().fetch() : null;

  const manuals = Documents ? Documents.find().fetch() : null;

  const allActivities = parseActsWithResources(activitiesList, resourcesList);

  if (processesList) {
    processesList.forEach((process) => {
      if (process.meetings) {
        process.meetings.forEach((meeting) => {
          allActivities.push({
            title: process.title,
            start: moment(
              meeting.startDate + meeting.startTime,
              'YYYY-MM-DD HH:mm'
            ).toDate(),
            end: moment(
              meeting.endDate + meeting.endTime,
              'YYYY-MM-DD HH:mm'
            ).toDate(),
            startDate: meeting.startDate,
            startTime: meeting.startTime,
            endDate: meeting.endDate,
            endTime: meeting.endTime,
            authorName: process.adminUsername,
            resource: meeting.resource,
            longDescription: process.description,
            isMultipleDay: false,
            resourceIndex: meeting.resourceIndex,
            isPublicActivity: true,
            imageUrl: process.imageUrl,
            _id: process._id,
            isProcess: true,
            isPrivateProcess: process.isPrivate,
          });
        });
      }
    });
  }

  return {
    isLoading,
    allActivities,
    currentUser,
    resourcesList,
    manuals,
  };
})(Calendar);

export default CalendarContainer;
