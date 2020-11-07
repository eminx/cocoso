import { Meteor } from 'meteor/meteor';
import { getHost, isContributorOrAdmin, isParticipant } from './shared';

const publicSettings = Meteor.settings.public;
const contextName = publicSettings.contextName;

import { getRoomIndex, siteUrl } from './shared';

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

    const roomIndex = getRoomIndex(formValues.room);

    try {
      const add = Activities.insert(
        {
          host,
          authorId: user._id,
          authorName: user.username,
          title: formValues.title,
          subTitle: formValues.subTitle || null,
          longDescription: formValues.longDescription,
          room: formValues.room || null,
          place: formValues.place || null,
          practicalInfo: formValues.practicalInfo || null,
          internalInfo: formValues.internalInfo || null,
          address: formValues.address || null,
          capacity: formValues.capacity || 20,
          datesAndTimes: formValues.datesAndTimes,
          roomIndex: roomIndex,
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
              console.log('Chat is not created due to error: ', error);
            }
          });
        }
      );
      return add;
    } catch (e) {
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

    const roomIndex = getRoomIndex(formValues.room);
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
          room: formValues.room || null,
          place: formValues.place || null,
          practicalInfo: formValues.practicalInfo || null,
          internalInfo: formValues.internalInfo || null,
          address: formValues.address || null,
          roomIndex: roomIndex,
          datesAndTimes: formValues.datesAndTimes,
          isPublicActivity: formValues.isPublicActivity,
          isActivitiesDisabled: formValues.isActivitiesDisabled,
          imageUrl,
          latestUpdate: new Date(),
        },
      });
      return activityId;
    } catch (error) {
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
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isParticipant(user, currentHost)) {
      throw new Meteor.Error('Please become a participant first');
    }

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
      console.log(error);
      throw new Meteor.Error(error, "Couldn't add to collection");
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
      console.log(error);
      throw new Meteor.Error(error, "Couldn't update document");
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
      console.log(error);
      throw new Meteor.Error(error, "Couldn't update document");
    }
  },
});
