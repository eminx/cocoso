import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import { parseActsWithResources } from '../@/shared';
import Calendar from './Calendar';

import Processes from '../../api/processes/process';
import Documents from '../../api/documents/document';
import Resources from '../../api/resources/resource';
import Activities from '../../api/activities/activity'; 

moment.locale(i18n.language);
const CalendarContainer = withTracker((props) => {
  const activities = Meteor.subscribe('activities');
  const isLoading = !activities.ready();
  const activitiesList = Activities ? Activities.find().fetch() : null;
  const currentUser = Meteor.user();
  const resourcesSub = Meteor.subscribe('resources');
  const resourcesList = Resources ? Resources.find().fetch() : null;
  resourcesList.forEach(resource => {
    if (resource.isCombo) resource = fetchComboResources(resource);
  });
  const processesSubscription = Meteor.subscribe('processes');
  const processesList = Processes ? Processes.find().fetch() : null;

  const manuals = Documents ? Documents.find().fetch() : null;

  const allActivities = parseActsWithResources(activitiesList, resourcesList);

  const [ tc ] = useTranslation('common');

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

  function fetchComboResources(resource) {
    const resourcesForCombo =  Resources.find(
      { _id : { $in : resource.resourcesForCombo } }, 
      { fields: { label: 1, resourceIndex: 1 } }
    ).fetch();
    resource.resourcesForCombo = resourcesForCombo;
    return resource;
  }

  return {
    isLoading,
    allActivities,
    currentUser,
    // resourcesList,
    manuals,
    tc,
  };
})(Calendar);

export default CalendarContainer;
