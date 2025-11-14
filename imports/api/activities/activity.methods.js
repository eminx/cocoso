import { Meteor } from 'meteor/meteor';
import dayjs from 'dayjs';

import { getHost } from '../_utils/shared';
import { isAdmin, isContributorOrAdmin } from '../users/user.roles';
import Hosts from '../hosts/host';
import Activities from './activity';
import Groups from '../groups/group';
import Resources from '../resources/resource';
import Platform from '../platform/platform';
import {
  getRegistrationEmailBody,
  getUnregistrationEmailBody,
} from './activity.mails';
import {
  compareDatesForSortActivities,
  compareDatesForSortActivitiesReverse,
  parseGroupActivities,
} from './activity.helpers';

const filterPrivateGroups = async (activities, user) => {
  if (!activities) {
    return [];
  }
  const filterResults = await Promise.all(
    activities.map(async (act) => {
      if (!act.isGroupPrivate) {
        return true;
      }
      if (!user) {
        return false;
      }
      const group = await Groups.findOneAsync({ _id: act.groupId });
      const userId = user?._id;
      return (
        group.adminId === userId ||
        group.members.some((member) => member.memberId === userId) ||
        group.peopleInvited.some(
          (person) => person.email === user.emails[0].address
        )
      );
    })
  );
  return activities.filter((_, index) => filterResults[index]);
};

Meteor.methods({
  async getAllPublicActivitiesFromAllHosts(showPast = false) {
    const user = await Meteor.userAsync();
    const today = dayjs().format('YYYY-MM-DD');

    try {
      if (showPast) {
        const pastActs = await Activities.find({
          $or: [{ isPublicActivity: true }, { isGroupMeeting: true }],
          'datesAndTimes.endDate': { $lte: today },
        }).fetchAsync();
        const pastActsSorted = parseGroupActivities(pastActs)?.sort(
          compareDatesForSortActivitiesReverse
        );
        return await filterPrivateGroups(pastActsSorted, user);
      }
      const futureActs = await Activities.find({
        $or: [{ isPublicActivity: true }, { isGroupMeeting: true }],
        'datesAndTimes.endDate': { $gte: today },
      }).fetchAsync();
      const futureActsSorted = parseGroupActivities(futureActs)?.sort(
        compareDatesForSortActivities
      );
      return await filterPrivateGroups(futureActsSorted, user);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  async getAllPublicActivities(showPast = false, hostPredefined) {
    const host = hostPredefined || getHost(this);
    const user = await Meteor.userAsync();
    console.log('user', user);
    const today = dayjs().format('YYYY-MM-DD');

    try {
      if (showPast) {
        const pastActs = await Activities.find({
          host,
          $or: [{ isPublicActivity: true }, { isGroupMeeting: true }],
          'datesAndTimes.endDate': { $lte: today },
        }).fetchAsync();
        const pastActsSorted = parseGroupActivities(pastActs)?.sort(
          compareDatesForSortActivitiesReverse
        );
        return await filterPrivateGroups(pastActsSorted, user);
      }
      const futureActs = await Activities.find({
        host,
        $or: [{ isPublicActivity: true }, { isGroupMeeting: true }],
        'datesAndTimes.endDate': { $gte: today },
      }).fetchAsync();

      const futureActsSorted = parseGroupActivities(futureActs)?.sort(
        compareDatesForSortActivities
      );
      return await filterPrivateGroups(futureActsSorted, user);
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  async getAllActivitiesFromAllHosts() {
    const user = await Meteor.userAsync();
    try {
      const allActs = await Activities.find().fetchAsync();
      const allActsParsed = parseGroupActivities(allActs);
      return await filterPrivateGroups(allActsParsed, user);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  async getAllActivities(hostPredefined) {
    const host = hostPredefined || getHost(this);

    const user = await Meteor.userAsync();
    try {
      const allActs = await Activities.find({
        host,
      }).fetchAsync();
      const allActsParsed = parseGroupActivities(allActs);
      return await filterPrivateGroups(allActsParsed, user);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  async getActivityById(activityId) {
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    try {
      if (!host || currentHost.isPortal) {
        return await Activities.findOneAsync(activityId);
      }
      return await Activities.findOneAsync({ _id: activityId, host });
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  async getMyActivities(hostPredefined) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    const host = hostPredefined || getHost(this);

    try {
      const activities = await Activities.find({
        host,
        authorId: user._id,
      }).fetchAsync();
      return activities;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  async getActivitiesByUser(username, hostPredefined) {
    if (!username) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = hostPredefined || getHost(this);
    const platform = await Platform.findOneAsync();

    try {
      if (platform?.isFederationLayout) {
        return await Activities.find({
          authorName: username,
        }).fetchAsync();
      }
      return await Activities.find({
        host,
        authorName: username,
      }).fetchAsync();
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

    const resourcesInQuestion = await Resources.find(
      {
        host,
        $or: [
          {
            _id: resourceId,
          },
          {
            'resourcesForCombo._id': resourceId,
          },
        ],
      },
      {
        fields: {
          _id: 1,
        },
      }
    ).fetchAsync();

    const resourcesIds = resourcesInQuestion.map((resource) => resource._id);

    const activityWithConflict = await Activities.findOneAsync(
      {
        _id: { $ne: currentActivityId },
        host,
        $and: [
          {
            $or: [
              {
                resourceId: {
                  $in: resourcesIds,
                },
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

    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

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
        await Meteor.callAsync(
          'createChat',
          values.title,
          activityId,
          'activities'
        );
      }
      return activityId;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  async updateActivity(activityId, values) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    const theActivity = await Activities.findOneAsync(activityId);

    if (!theActivity) {
      throw new Meteor.Error('Activity not found!');
    }

    if (user._id !== theActivity.authorId && !isAdmin(user, currentHost)) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      return await Activities.updateAsync(activityId, {
        $set: {
          ...values,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  async deleteActivity(activityId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    const theActivity = await Activities.findOneAsync(activityId);

    if (user._id !== theActivity.authorId && !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      await Activities.removeAsync(activityId);
      return true;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },

  async registerAttendance(activityId, values, occurenceIndex = 0) {
    const theActivity = await Activities.findOneAsync(activityId);
    const rsvpValues = {
      ...values,
      registerDate: new Date(),
    };

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const hostName = currentHost?.settings?.name;

    const field = `datesAndTimes.${occurenceIndex}.attendees`;
    const occurence = theActivity.datesAndTimes[occurenceIndex];
    const currentUser = await Meteor.userAsync();
    const emailBody = getRegistrationEmailBody(
      theActivity,
      values,
      occurence,
      currentHost,
      currentUser
    );

    try {
      await Activities.updateAsync(activityId, {
        $push: {
          [field]: rsvpValues,
        },
      });
      await Meteor.callAsync(
        'sendEmail',
        values.email,
        `"${theActivity.title}", ${hostName}`,
        emailBody
      );
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't register attendance");
    }
  },

  async updateAttendance(activityId, values, occurenceIndex, attendeeIndex) {
    const theActivity = await Activities.findOneAsync(activityId);
    const rsvpValues = {
      ...values,
      registerDate: new Date(),
    };
    const newDatesAndTimes = [...theActivity.datesAndTimes];
    const theOccurence = newDatesAndTimes[occurenceIndex];

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const currentUser = await Meteor.userAsync();
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
      await Activities.updateAsync(activityId, {
        $set: {
          [field]: rsvpValues,
        },
      });
      await Meteor.callAsync(
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

  async removeAttendance(activityId, occurenceIndex, email, lastName) {
    const currentUser = await Meteor.userAsync();
    const theActivity = await Activities.findOneAsync(activityId);
    const newOccurences = [...theActivity.datesAndTimes];
    const theOccurence = newOccurences[occurenceIndex];
    const theNonAttendee = theOccurence.attendees.find(
      (a) => a.email === email
    );

    newOccurences[occurenceIndex].attendees = theOccurence.attendees.filter(
      (a) => {
        if (theActivity.isGroupMeeting) {
          return email !== a.email;
        }
        return a.email !== email || a.lastName !== lastName;
      }
    );

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const hostName = currentHost.settings.name;

    try {
      await Activities.updateAsync(activityId, {
        $set: {
          datesAndTimes: newOccurences,
        },
      });
      await Meteor.callAsync(
        'sendEmail',
        email,
        `Update to your registration for "${theActivity.title}" at ${hostName}`,
        getUnregistrationEmailBody(
          theActivity,
          theNonAttendee,
          currentHost,
          currentUser
        )
      );
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't update document");
    }
  },
});
