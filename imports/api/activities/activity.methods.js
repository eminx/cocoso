import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { getHost } from '../_utils/shared';
import { isContributorOrAdmin } from '../users/user.roles';
import Hosts from '../hosts/host';
import Activities from './activity';
import Resources from '../resources/resource';
import { getRegistrationEmailBody, getUnregistrationEmailBody } from './activity.mails';

Meteor.methods({
  getMyActivities() {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = getHost(this);

    try {
      const activities = Activities.find({
        host,
        authorId: user._id,
      }).fetch();
      return activities;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch works");
    }
  },

  getAllOccurences() {
    const host = getHost(this);
    try {
      const activities = Activities.find(
        { host },
        {
          fields: {
            title: 1,
            authorName: 1,
            longDescription: 1,
            isPublicActivity: 1,
            imageUrl: 1,
            datesAndTimes: 1,
            resource: 1,
            resourceIndex: 1,
          },
        }
      ).fetch();

      const occurences = [];

      activities.forEach((activity) => {
        if (activity?.datesAndTimes && activity.datesAndTimes.length > 0) {
          activity.datesAndTimes.forEach((recurrence) => {
            const occurence = {
              _id: activity._id,
              title: activity.title,
              authorName: activity.authorName,
              longDescription: activity.longDescription,
              imageUrl: activity.imageUrl,
              isPublicActivity: activity.isPublicActivity,
              isWithComboResource: false,
              start: moment(
                recurrence.startDate + recurrence.startTime,
                'YYYY-MM-DD HH:mm'
              ).toDate(),
              end: moment(recurrence.endDate + recurrence.endTime, 'YYYY-MM-DD HH:mm').toDate(),
              startDate: recurrence.startDate,
              startTime: recurrence.startTime,
              endDate: recurrence.endDate,
              endTime: recurrence.endTime,
              isMultipleDay:
                recurrence.isMultipleDay || recurrence.startDate !== recurrence.endDate,
            };

            const resource = Resources.findOne(activity.resourceId, {
              fields: { isCombo: 1 },
            });

            if (resource?.isCombo) {
              resource.resourcesForCombo.forEach((resId) => {
                const res = Resources.findOne(resId, {
                  fields: { label: 1, resourceIndex: 1 },
                });
                occurences.push({
                  ...occurence,
                  resource: res.label,
                  resourceIndex: res.resourceIndex,
                });
              });
            }

            occurences.push({
              ...occurence,
              resource: activity.resource,
              resourceIndex: activity.resourceIndex,
            });
          });
        }
      });

      return occurences;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch works");
    }
  },

  createActivity(values) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    if (values.isPublicActivity && !values.imageUrl) {
      throw new Meteor.Error('Image is required for public activities');
    }

    try {
      const activityId = Activities.insert({
        ...values,
        host,
        authorId: user._id,
        authorName: user.username,
        isSentForReview: false,
        isPublished: true,
        creationDate: new Date(),
      });
      // () => {
      //   if (!formValues.isPublicActivity) {
      //     return;
      //   }
      //   Meteor.call('createChat', formValues.title, add, (error, result) => {
      //     if (error) {
      //       throw new Meteor.Error('Chat is not created');
      //     }
      //   });
      // }
      return activityId;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  updateActivity(activityId, values) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theActivity = Activities.findOne(activityId);
    if (user._id !== theActivity.authorId) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Activities.update(activityId, {
        $set: {
          ...values,
        },
      });
      return activityId;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  deleteActivity(activityId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const activityToDelete = Activities.findOne(activityId);
    if (activityToDelete.authorId !== user._id) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Activities.remove(activityId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },

  registerAttendance(activityId, values, occurenceIndex = 0) {
    const theActivity = Activities.findOne(activityId);
    const rsvpValues = {
      ...values,
      registerDate: new Date(),
    };

    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const hostName = currentHost.settings.name;

    const field = `datesAndTimes.${occurenceIndex}.attendees`;
    const occurence = theActivity.datesAndTimes[occurenceIndex];

    try {
      Activities.update(activityId, {
        $push: {
          [field]: rsvpValues,
        },
      });
      Meteor.call(
        'sendEmail',
        values.email,
        `Your registration for "${theActivity.title}" at ${hostName}`,
        getRegistrationEmailBody(
          values.firstName,
          values.numberOfPeople,
          occurence,
          activityId,
          hostName,
          host
        )
      );
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't register attendance");
    }
  },

  updateAttendance(activityId, values, occurenceIndex, attendeeIndex) {
    const theActivity = Activities.findOne(activityId);
    const rsvpValues = {
      ...values,
      registerDate: new Date(),
    };

    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const hostName = currentHost.settings.name;

    const field = `datesAndTimes.${occurenceIndex}.attendees.${attendeeIndex}`;
    const occurence = theActivity.datesAndTimes[occurenceIndex];

    try {
      Activities.update(activityId, {
        $set: {
          [field]: rsvpValues,
        },
      });
      Meteor.call(
        'sendEmail',
        values.email,
        `Update to your registration for "${theActivity.title}" at ${hostName}`,
        getRegistrationEmailBody(
          values.firstName,
          values.numberOfPeople,
          occurence,
          activityId,
          hostName,
          host
        )
      );
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't update attendance");
    }
  },

  removeAttendance(activityId, occurenceIndex, attendeeIndex) {
    const theActivity = Activities.findOne(activityId);
    const occurences = [...theActivity.datesAndTimes];
    const theOccurence = occurences[occurenceIndex];
    const theNonAttendee = theOccurence.attendees[attendeeIndex];

    const theAttendees = [...theOccurence.attendees];
    const theAttendeesWithout = theAttendees.filter((attendee, theAttendeeIndex) => theAttendeeIndex !== attendeeIndex);

    occurences[occurenceIndex].attendees = theAttendeesWithout;

    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const hostName = currentHost.settings.name;

    try {
      Activities.update(activityId, {
        $set: {
          datesAndTimes: occurences,
        },
      });
      Meteor.call(
        'sendEmail',
        theNonAttendee.email,
        `Update to your registration for "${theActivity.title}" at ${hostName}`,
        getUnregistrationEmailBody(
          theNonAttendee.firstName,
          theOccurence,
          activityId,
          hostName,
          host
        )
      );
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't update document");
    }
  },
});
