import { Meteor } from 'meteor/meteor';
const Logger = require('logdna');
import {
  getHost,
  isContributorOrAdmin,
  isParticipant,
  getLogdnaOptions,
  isAdmin,
  isMember,
} from './shared';

const publicSettings = Meteor.settings.public;
const contextName = publicSettings.contextName;

import { getResourceIndex, siteUrl } from './shared';

const getRegistrationText = (
  firstName,
  numberOfPeople,
  occurence,
  activityId
) => {
  return `Hi ${firstName},\n\nThis is a confirmation email to inform you that you have successfully signed up for this event.\nYou have registered to come ${numberOfPeople} ${
    numberOfPeople === 1 ? 'person' : 'people'
  } in total for the event on ${occurence.startDate} at ${
    occurence.startTime
  }.\nMay there be any changes to that, please go to this link to change your RSVP: ${siteUrl}event/${activityId}.\nThen by opening the date you signed up for, click the "Change RSVP" link and follow the instructions there.\nWe look forward to your participation.\n\n${contextName} Team`;
};

const getRemovalText = (firstName, occurence, activityId) => {
  return `Hi ${firstName},\n\nThis is a confirmation email to inform you that you have successfully removed your registration from this event.\nYou have previously registered to attend the event on ${occurence.startDate} at ${occurence.startTime}, which you just signed out of. \nIf you want to RSVP again, you can do so here at the event page: ${siteUrl}event/${activityId}.\n\nKind regards,\n${contextName} Team`;
};

Meteor.methods({
  createActivity(formValues, uploadedImage) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    if (formValues.isPublicActivity && !uploadedImage) {
      throw new Meteor.Error('Image is required for public activities');
    }

    check(formValues.title, String);
    formValues.datesAndTimes.forEach((recurrence) => {
      check(recurrence.startDate, String);
      check(recurrence.endDate, String);
      check(recurrence.startTime, String);
      check(recurrence.endTime, String);
    });
    check(formValues.isPublicActivity, Boolean);
    const resourceIndex = getResourceIndex(formValues.resource, host);

    try {
      const add = Activities.insert(
        {
          host,
          authorId: user._id,
          authorName: user.username,
          title: formValues.title,
          subTitle: formValues.subTitle || null,
          longDescription: formValues.longDescription,
          resource: formValues.resource || null,
          place: formValues.place || null,
          practicalInfo: formValues.practicalInfo || null,
          internalInfo: formValues.internalInfo || null,
          address: formValues.address || null,
          capacity: formValues.capacity || 20,
          datesAndTimes: formValues.datesAndTimes,
          resourceIndex,
          imageUrl: uploadedImage || null,
          isSentForReview: false,
          isPublicActivity: formValues.isPublicActivity,
          isActivitiesDisabled: formValues.isActivitiesDisabled,
          isPublished: true,
          creationDate: new Date(),
        },
        () => {
          if (!formValues.isPublicActivity) {
            return;
          }
          Meteor.call('createChat', formValues.title, add, (error, result) => {
            if (error) {
              Logger.createLogger(
                `Chat is not created due to error: ${
                  error.reason || error.error
                }`
              );
              throw new Meteor.Error('Chat is not created');
            }
          });
        }
      );
      return add;
    } catch (error) {
      // Logger.createLogger(
      //   `Activity could not be created due to: ${error.reason || error.error}`
      // ),
      getLogdnaOptions(this);
      throw new Meteor.Error(e, "Couldn't add to Collection");
    }
  },

  updateActivity(formValues, activityId, imageUrl) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    formValues.datesAndTimes.forEach((recurrence) => {
      check(recurrence.startDate, String);
      check(recurrence.endDate, String);
      check(recurrence.startTime, String);
      check(recurrence.endTime, String);
    });
    const resourceIndex = getResourceIndex(formValues.resource, host);
    const theG = Activities.findOne(activityId);
    if (user._id !== theG.authorId) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Activities.update(activityId, {
        $set: {
          title: formValues.title,
          subTitle: formValues.subTitle || null,
          longDescription: formValues.longDescription,
          resource: formValues.resource || null,
          place: formValues.place || null,
          practicalInfo: formValues.practicalInfo || null,
          internalInfo: formValues.internalInfo || null,
          address: formValues.address || null,
          resourceIndex: resourceIndex,
          datesAndTimes: formValues.datesAndTimes,
          isPublicActivity: formValues.isPublicActivity,
          isActivitiesDisabled: formValues.isActivitiesDisabled,
          imageUrl,
          latestUpdate: new Date(),
        },
      });
      return activityId;
    } catch (error) {
      // Logger.createLogger(
      //   `Couldn't update activity due to: ${error.reason || error.error}`
      // );
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
      // Logger.createLogger(
      //   `Couldn't delete activity due to: ${error.reason || error.error}`
      // );
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },

  registerAttendance(activityId, values, occurenceIndex = 0) {
    const theActivity = Activities.findOne(activityId);
    const occurences = [...theActivity.datesAndTimes];
    values.registerDate = new Date();
    if (occurences[occurenceIndex].attendees) {
      occurences[occurenceIndex].attendees.push(values);
    } else {
      occurences[occurenceIndex].attendees = [values];
    }

    try {
      Activities.update(activityId, {
        $set: {
          datesAndTimes: occurences,
        },
      });
      Meteor.call(
        'sendEmail',
        values.email,
        `Your registration for "${theActivity.title}" at ${contextName}`,
        getRegistrationText(
          values.firstName,
          values.numberOfPeople,
          occurences[occurenceIndex],
          activityId
        )
      );
    } catch (error) {
      // Logger.createLogger(
      //   `Couldn't register attendance due to: ${error.reason || error.error}`
      // );
      throw new Meteor.Error(error, "Couldn't register attendance");
    }
  },

  updateAttendance(activityId, values, occurenceIndex, attendeeIndex) {
    check(activityId, String);
    check(occurenceIndex, Number);
    check(values.firstName, String);
    check(values.lastName, String);
    check(values.email, String);
    check(values.numberOfPeople, Number);

    const theActivity = Activities.findOne(activityId);
    const occurences = [...theActivity.datesAndTimes];
    occurences[occurenceIndex].attendees[attendeeIndex] = values;

    try {
      Activities.update(activityId, {
        $set: {
          datesAndTimes: occurences,
        },
      });
      Meteor.call(
        'sendEmail',
        values.email,
        `Update to your registration for "${theActivity.title}" at ${contextName}`,
        getRegistrationText(
          values.firstName,
          values.numberOfPeople,
          occurences[occurenceIndex],
          activityId
        )
      );
    } catch (error) {
      // Logger.createLogger(
      //   `Couldn't update attendance due to: ${error.reason || error.error}`
      // );
      throw new Meteor.Error(error, "Couldn't update attendance");
    }
  },

  removeAttendance(activityId, occurenceIndex, attendeeIndex, email) {
    check(activityId, String);
    check(occurenceIndex, Number);
    check(attendeeIndex, Number);
    check(email, String);

    const theActivity = Activities.findOne(activityId);
    const occurences = [...theActivity.datesAndTimes];
    const theOccurence = occurences[occurenceIndex];
    const theNonAttendee = theOccurence.attendees[attendeeIndex];

    occurences[occurenceIndex].attendees.splice(attendeeIndex, 1);

    try {
      Activities.update(activityId, {
        $set: {
          datesAndTimes: occurences,
        },
      });
      Meteor.call(
        'sendEmail',
        theNonAttendee.email,
        `Update to your registration for "${theActivity.title}" at ${contextName}`,
        getRemovalText(theNonAttendee.firstName, theOccurence, activityId)
      );
    } catch (error) {
      // Logger.createLogger(
      //   `Couldn't remove attendance due to: ${error.reason || error.error}`
      // );
      throw new Meteor.Error(error, "Couldn't update document");
    }
  },
});
