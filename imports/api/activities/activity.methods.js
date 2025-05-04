import { Meteor } from 'meteor/meteor';
import dayjs from 'dayjs';

import { getHost } from '../_utils/shared';
import { isAdmin, isContributorOrAdmin } from '../users/user.roles';
import Hosts from '../hosts/host';
import Activities from './activity';
import Groups from '../groups/group';
import Platform from '../platform/platform';
import { getRegistrationEmailBody, getUnregistrationEmailBody } from './activity.mails';
import {
  compareDatesForSortActivities,
  compareDatesForSortActivitiesReverse,
} from './activity.helpers';

const filterPrivateGroups = (activities, user) =>
  activities.filter((act) => {
    if (!act.isGroupPrivate) {
      return true;
    }
    if (!user) {
      return false;
    }
    const group = Groups.findOne({ _id: act.groupId });
    const userId = user?._id;
    return (
      group.adminId === userId ||
      group.members.some((member) => member.memberId === userId) ||
      group.peopleInvited.some((person) => person.email === user.emails[0].address)
    );
  });

Meteor.methods({
  getAllPublicActivitiesFromAllHosts(showPast = false) {
    const user = Meteor.user();
    const today = dayjs().format('YYYY-MM-DD');

    try {
      if (showPast) {
        const pastActs = Activities.find({
          $or: [{ isPublicActivity: true }, { isGroupMeeting: true }],
          'datesAndTimes.endDate': { $lte: today },
        }).fetch();
        const pastActsSorted = pastActs?.sort(compareDatesForSortActivitiesReverse);
        return filterPrivateGroups(pastActsSorted, user);
      }
      const futureActs = Activities.find({
        $or: [{ isPublicActivity: true }, { isGroupMeeting: true }],
        'datesAndTimes.endDate': { $gte: today },
      }).fetch();
      const futureActsSorted = futureActs?.sort(compareDatesForSortActivities);
      return filterPrivateGroups(futureActsSorted, user);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  getAllPublicActivities(showPast = false, hostPredefined) {
    const host = hostPredefined || getHost(this);
    const user = Meteor.user();
    const today = dayjs().format('YYYY-MM-DD');

    try {
      if (showPast) {
        const pastActs = Activities.find({
          host,
          $or: [{ isPublicActivity: true }, { isGroupMeeting: true }],
          'datesAndTimes.endDate': { $lte: today },
        }).fetch();
        const pastActsSorted = pastActs?.sort(compareDatesForSortActivitiesReverse);
        return filterPrivateGroups(pastActsSorted, user);
      }
      const futureActs = Activities.find({
        host,
        $or: [{ isPublicActivity: true }, { isGroupMeeting: true }],
        'datesAndTimes.endDate': { $gte: today },
      }).fetch();
      const futureActsSorted = futureActs?.sort(compareDatesForSortActivities);
      return filterPrivateGroups(futureActsSorted, user);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  getAllActivitiesFromAllHosts() {
    const user = Meteor.user();
    try {
      const allActs = Activities.find().fetch();
      return filterPrivateGroups(allActs, user);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  getAllActivities(hostPredefined) {
    const host = hostPredefined || getHost(this);

    const user = Meteor.user();
    try {
      const allActs = Activities.find({
        host,
      }).fetch();
      return filterPrivateGroups(allActs, user);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  getActivityById(activityId) {
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    try {
      if (!host || currentHost.isPortal) {
        return Activities.findOne(activityId);
      }
      return Activities.findOne({ _id: activityId, host });
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  getMyActivities(hostPredefined) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    const host = hostPredefined || getHost(this);

    try {
      const activities = Activities.find({
        host,
        authorId: user._id,
      }).fetch();
      return activities;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  getActivitiesByUser(username) {
    if (!username) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = getHost(this);
    const platform = Platform.findOne();

    try {
      if (platform?.isFederationLayout) {
        return Activities.find({
          authorName: username,
        }).fetch();
      }
      return Activities.find({
        host,
        authorName: username,
      }).fetch();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch activities");
    }
  },

  async checkDatesForConflict(
    { startDate, endDate, startTime, endTime, resourceId },
    currentActivityId = null
  ) {
    const host = getHost(this);
    if (!resourceId) {
      return null;
    }

    const activityWithConflict = await Activities.findOneAsync(
      {
        _id: { $ne: currentActivityId },
        host,
        $and: [
          {
            $or: [
              {
                resourceId,
              },
              {
                'resourcesForCombo._id': resourceId,
              },
            ],
          },
          {
            $or: [
              {
                datesAndTimes: {
                  $elemMatch: {
                    startDate: {
                      $lt: endDate,
                    },
                    endDate: {
                      $gt: startDate,
                    },
                  },
                },
              },
              {
                datesAndTimes: {
                  $elemMatch: {
                    startDate: endDate,
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime },
                  },
                },
              },
              {
                datesAndTimes: {
                  $elemMatch: {
                    endDate: startDate,
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        fields: {
          _id: 1,
          datesAndTimes: 1,
          isExclusiveActivity: 1,
          title: 1,
        },
      }
    );

    if (!activityWithConflict) {
      return null;
    }

    return activityWithConflict;
  },

  async createActivity(values) {
    if (!values) {
      return null;
    }

    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const images = values.images;

    if (values.isPublicActivity && (!images || images.length === 0)) {
      throw new Meteor.Error('Image is required for public activities');
    }

    try {
      const activityId = await Activities.insertAsync({
        ...values,
        host,
        authorId: user._id,
        authorName: user.username,
        isSentForReview: false,
        isPublished: true,
        creationDate: new Date(),
      });
      if (values.isPublicActivity) {
        await Meteor.callAsync('createChat', values.title, activityId, 'activities');
      }
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

    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    const theActivity = Activities.findOne(activityId);

    if (!theActivity) {
      throw new Meteor.Error('Activity not found!');
    }

    if (user._id !== theActivity.authorId && !isAdmin(user, currentHost)) {
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

    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    const theActivity = Activities.findOne(activityId);

    if (user._id !== theActivity.authorId && !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Activities.remove(activityId);
      return true;
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
    const hostName = currentHost?.settings?.name;

    const field = `datesAndTimes.${occurenceIndex}.attendees`;
    const occurence = theActivity.datesAndTimes[occurenceIndex];
    const currentUser = Meteor.user();
    const emailBody = getRegistrationEmailBody(
      theActivity,
      values,
      occurence,
      currentHost,
      currentUser
    );

    try {
      Activities.update(activityId, {
        $push: {
          [field]: rsvpValues,
        },
      });
      Meteor.call('sendEmail', values.email, `"${theActivity.title}", ${hostName}`, emailBody);
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't register attendance");
    }
  },

  updateAttendance(activityId, values, occurenceIndex, attendeeIndex) {
    const theActivity = Activities.findOne(activityId);
    const rsvpValues = {
      ...values,
      registerDate: new Date(),
    };
    const newDatesAndTimes = [...theActivity.datesAndTimes];
    const theOccurence = newDatesAndTimes[occurenceIndex];

    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const currentUser = Meteor.user();
    const emailBody = getRegistrationEmailBody(
      theActivity,
      rsvpValues,
      theOccurence,
      currentHost,
      currentUser,
      true
    );

    const field = `datesAndTimes.${occurenceIndex}.attendees.${attendeeIndex}`;

    try {
      Activities.update(activityId, {
        $set: {
          [field]: rsvpValues,
        },
      });
      Meteor.call(
        'sendEmail',
        values.email,
        `Update to your registration for "${theActivity.title}" at ${currentHost.settings.name}`,
        emailBody
      );
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't update attendance");
    }
  },

  removeAttendance(activityId, occurenceIndex, email, lastName) {
    const currentUser = Meteor.user();
    const theActivity = Activities.findOne(activityId);
    const newOccurences = [...theActivity.datesAndTimes];
    const theOccurence = newOccurences[occurenceIndex];
    const theNonAttendee = theOccurence.attendees.find((a) => a.email === email);

    newOccurences[occurenceIndex].attendees = theOccurence.attendees.filter((a) => {
      if (theActivity.isGroupMeeting) {
        return email !== a.email;
      }
      return a.email !== email || a.lastName !== lastName;
    });

    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const hostName = currentHost.settings.name;

    try {
      Activities.update(activityId, {
        $set: {
          datesAndTimes: newOccurences,
        },
      });
      Meteor.call(
        'sendEmail',
        email,
        `Update to your registration for "${theActivity.title}" at ${hostName}`,
        getUnregistrationEmailBody(theActivity, theNonAttendee, currentHost, currentUser)
      );
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't update document");
    }
  },
});
