import { Meteor } from 'meteor/meteor';
import { getHost } from '../@/shared';
import { isContributorOrAdmin } from '../@users/user.roles';
import Hosts from '../@hosts/host';
import Activities from './activity';
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

    try {
      const add = Activities.insert({
        host: host,
        authorId: user._id,
        authorName: user.username,
        title: formValues.title,
        subTitle: formValues.subTitle || null,
        longDescription: formValues.longDescription,
        resource: formValues.resource.label || null,
        resourceId: formValues.resource._id,
        resourceIndex: formValues.resource.resourceIndex,
        place: formValues.place || null,
        practicalInfo: formValues.practicalInfo || null,
        internalInfo: formValues.internalInfo || null,
        address: formValues.address || null,
        capacity: formValues.capacity || 20,
        datesAndTimes: formValues.datesAndTimes,
        imageUrl: uploadedImage || null,
        isSentForReview: false,
        isPublicActivity: formValues.isPublicActivity,
        isRegistrationDisabled: formValues.isRegistrationDisabled,
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
      return add;
    } catch (error) {
      console.log(error)
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  updateActivity(formValues, activityId, imageUrl) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }
    
    const resourceIndex = formValues.resource.resourceIndex;
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
          resource: formValues.resource.label || null,
          resourceId: formValues.resource._id,
          resourceIndex: resourceIndex,
          place: formValues.place || null,
          practicalInfo: formValues.practicalInfo || null,
          internalInfo: formValues.internalInfo || null,
          address: formValues.address || null,
          datesAndTimes: formValues.datesAndTimes,
          isPublicActivity: formValues.isPublicActivity,
          isRegistrationDisabled: formValues.isRegistrationDisabled,
          imageUrl,
          latestUpdate: new Date(),
        },
      });
      return activityId;
    } catch (error) {
      console.log(error)
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

  removeAttendance(activityId, occurenceIndex, attendeeIndex, email) {
    const theActivity = Activities.findOne(activityId);
    const occurences = [...theActivity.datesAndTimes];
    const theOccurence = occurences[occurenceIndex];
    const theNonAttendee = theOccurence.attendees[attendeeIndex];

    occurences[occurenceIndex].attendees.splice(attendeeIndex, 1);

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