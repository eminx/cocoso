import { Meteor } from 'meteor/meteor';
import dayjs from 'dayjs';

import { getHost } from '../_utils/shared';
import { isAdmin, isContributorOrAdmin } from '../users/user.roles';
import Hosts from '../hosts/host';
import Activities from './activity';
import Resources from '../resources/resource';
import Platform from '../platform/platform';
import Occurrences from '../occurrences/occurrence';
import Registrations from '../registrations/registration';
import {
  MAX_OCCURRENCE_DURATION_DAYS,
  toDateTime,
  insertOccurrence,
  reconcileOccurrences,
  removeOccurrencesForActivity,
  hydrateActivities,
  hydrateActivity,
} from '../occurrences/occurrence.helpers';
import {
  getRegistrationEmailBody,
  getUnregistrationEmailBody,
} from './activity.mails';
import {
  compareDatesForSortActivities,
  compareDatesForSortActivitiesReverse,
  parseGroupActivities,
  filterPrivateGroups,
} from './activity.helpers';

// Every occurrence belonging to `activityId`, sorted the same way the old
// embedded datesAndTimes array always was (by start date/time). Positional
// occurrenceIndex/attendeeIndex arguments below are resolved against this
// order, so they keep meaning what they meant before the extraction.
async function getSortedOccurrences(activityId) {
  const occurrences = await Occurrences.find({ activityId }).fetchAsync();
  return occurrences.sort((a, b) => a.startDateTime - b.startDateTime);
}

async function getSortedRegistrations(occurrenceId) {
  const registrations = await Registrations.find({ occurrenceId }).fetchAsync();
  return registrations.sort((a, b) => a.registerDate - b.registerDate);
}

// Activities whose resourceId (direct or via a combo resource) matches one
// of resourceId's group, for the given host — the first hop of the conflict
// check. Second hop (below) narrows by actual occurrence overlap.
async function findActivityIdsForResource(host, resourceId, excludeActivityId) {
  const resourcesInQuestion = await Resources.find(
    {
      host,
      $or: [{ _id: resourceId }, { 'resourcesForCombo._id': resourceId }],
    },
    { fields: { _id: 1 } }
  ).fetchAsync();
  const resourceIds = resourcesInQuestion.map((resource) => resource._id);

  if (resourceIds.length === 0) {
    return [];
  }

  return await Activities.find(
    {
      host,
      _id: { $ne: excludeActivityId },
      resourceId: { $in: resourceIds },
    },
    { fields: { _id: 1, isExclusiveActivity: 1, title: 1 } }
  ).fetchAsync();
}

// activityId set with at least one occurrence that hasn't fully ended yet
// (afterNow) or has fully ended (afterNow === false), for the given host
// filter (or none, for portal-wide "all hosts" listings).
async function findActivityIdsByOccurrenceWindow({ host, isPortalHost, afterNow }) {
  const now = new Date();
  const query = afterNow
    ? {
        startDateTime: {
          $gte: dayjs(now).subtract(MAX_OCCURRENCE_DURATION_DAYS, 'day').toDate(),
        },
        endDateTime: { $gte: now },
      }
    : {
        startDateTime: { $lte: now },
        endDateTime: { $lte: now },
      };

  if (!isPortalHost) {
    query.host = host;
  }

  const occurrences = await Occurrences.find(query, {
    fields: { activityId: 1 },
  }).fetchAsync();

  return [...new Set(occurrences.map((occ) => occ.activityId))];
}

Meteor.methods({
  async getAllPublicActivitiesFromAllHosts(showPast = false) {
    const user = await Meteor.userAsync();

    try {
      const activityIds = await findActivityIdsByOccurrenceWindow({
        isPortalHost: true,
        afterNow: !showPast,
      });
      const acts = await Activities.find({
        _id: { $in: activityIds },
        $or: [{ isPublicActivity: true }, { isGroupMeeting: true }],
      }).fetchAsync();
      const hydrated = await hydrateActivities(acts);
      const sorted = parseGroupActivities(hydrated)?.sort(
        showPast ? compareDatesForSortActivitiesReverse : compareDatesForSortActivities
      );
      return await filterPrivateGroups(sorted, user);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  async getAllPublicActivities(showPast = false, hostPredefined) {
    const host = hostPredefined || getHost(this);
    const user = await Meteor.userAsync();

    try {
      const activityIds = await findActivityIdsByOccurrenceWindow({
        host,
        afterNow: !showPast,
      });
      const acts = await Activities.find({
        _id: { $in: activityIds },
        host,
        $or: [{ isPublicActivity: true }, { isGroupMeeting: true }],
      }).fetchAsync();
      const hydrated = await hydrateActivities(acts);
      const sorted = parseGroupActivities(hydrated)?.sort(
        showPast ? compareDatesForSortActivitiesReverse : compareDatesForSortActivities
      );
      return await filterPrivateGroups(sorted, user);
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  async getAllActivitiesFromAllHosts() {
    const user = await Meteor.userAsync();
    try {
      const allActs = await Activities.find().fetchAsync();
      const hydrated = await hydrateActivities(allActs);
      const allActsParsed = parseGroupActivities(hydrated);
      return await filterPrivateGroups(allActsParsed, user);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  async getAllActivities(hostPredefined) {
    const host = hostPredefined || getHost(this);

    const user = await Meteor.userAsync();
    try {
      const allActs = await Activities.find({ host }).fetchAsync();
      const hydrated = await hydrateActivities(allActs);
      const allActsParsed = parseGroupActivities(hydrated);
      return await filterPrivateGroups(allActsParsed, user);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  async getActivityById(activityId) {
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    try {
      const activity =
        !host || currentHost.isPortal
          ? await Activities.findOneAsync(activityId)
          : await Activities.findOneAsync({ _id: activityId, host });
      return await hydrateActivity(activity);
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
      return await hydrateActivities(activities);
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
      const activities = platform?.isFederationLayout
        ? await Activities.find({ authorName: username }).fetchAsync()
        : await Activities.find({ host, authorName: username }).fetchAsync();
      return await hydrateActivities(activities);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch activities");
    }
  },

  // Advisory only — see imports/api/occurrences/occurrence.helpers.js note
  // and project memory: this does not (yet) guarantee against a concurrent
  // double-booking. It's a pre-save check called from the client, same as
  // before the extraction; closing the race is a separate, tracked follow-up.
  async checkDatesForConflict(
    { startDate, endDate, startTime, endTime, resourceId },
    currentActivityId = null
  ) {
    const host = getHost(this);
    if (!resourceId) {
      return null;
    }

    const candidateActivities = await findActivityIdsForResource(
      host,
      resourceId,
      currentActivityId
    );

    if (candidateActivities.length === 0) {
      return null;
    }

    const candidateActivitiesById = new Map(
      candidateActivities.map((act) => [act._id, act])
    );

    const targetStart = toDateTime(startDate, startTime);
    const targetEnd = toDateTime(endDate, endTime);
    const windowFloor = dayjs(targetStart)
      .subtract(MAX_OCCURRENCE_DURATION_DAYS, 'day')
      .toDate();

    // A single, correct interval-overlap test on real datetimes, replacing
    // the three ad-hoc date/time-string clauses the old $elemMatch query
    // needed (it had no combined datetime to compare against).
    const conflictingOccurrence = await Occurrences.findOneAsync({
      activityId: { $in: [...candidateActivitiesById.keys()] },
      startDateTime: { $gte: windowFloor, $lt: targetEnd },
      endDateTime: { $gt: targetStart },
    });

    if (!conflictingOccurrence) {
      return null;
    }

    const conflictingActivity = candidateActivitiesById.get(
      conflictingOccurrence.activityId
    );

    return {
      _id: conflictingActivity._id,
      title: conflictingActivity.title,
      isExclusiveActivity: conflictingActivity.isExclusiveActivity,
      datesAndTimes: [
        {
          startDate: conflictingOccurrence.startDate,
          startTime: conflictingOccurrence.startTime,
          endDate: conflictingOccurrence.endDate,
          endTime: conflictingOccurrence.endTime,
        },
      ],
    };
  },

  async createActivity(values) {
    if (!values) {
      return null;
    }

    const user = await Meteor.userAsync();
    const host = getHost(this);

    if (!user || !(await isContributorOrAdmin(user._id, host))) {
      throw new Meteor.Error('Not allowed!');
    }

    const images = values.images;

    if (values.isPublicActivity && (!images || images.length === 0)) {
      throw new Meteor.Error('Image is required for public activities');
    }

    const { datesAndTimes, ...activityValues } = values;

    try {
      const activityId = await Activities.insertAsync({
        ...activityValues,
        host,
        authorId: user._id,
        authorName: user.username,
        isSentForReview: false,
        isPublished: true,
        creationDate: new Date(),
      });

      for (const occurrence of datesAndTimes || []) {
        await insertOccurrence(host, activityId, occurrence);
      }

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

    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    const theActivity = await Activities.findOneAsync(activityId);

    if (!theActivity) {
      throw new Meteor.Error('Activity not found!');
    }

    if (
      user._id !== theActivity.authorId &&
      !(await isAdmin(user._id, host))
    ) {
      throw new Meteor.Error('You are not allowed!');
    }

    const { datesAndTimes, ...activityValues } = values;

    try {
      const result = await Activities.updateAsync(activityId, {
        $set: {
          ...activityValues,
        },
      });
      if (datesAndTimes) {
        await reconcileOccurrences(theActivity.host, activityId, datesAndTimes);
      }
      return result;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  async deleteActivity(activityId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);

    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    const theActivity = await Activities.findOneAsync(activityId);

    if (
      user._id !== theActivity.authorId &&
      !(await isAdmin(user._id, host))
    ) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      await removeOccurrencesForActivity(activityId);
      await Activities.removeAsync(activityId);
      return true;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },

  async registerAttendance(activityId, values, occurenceIndex = 0) {
    const theActivity = await Activities.findOneAsync(activityId);
    const occurrences = await getSortedOccurrences(activityId);
    const occurrence = occurrences[occurenceIndex];

    if (!occurrence) {
      throw new Meteor.Error('Occurrence not found');
    }

    const rsvpValues = {
      ...values,
      registerDate: new Date(),
    };

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const hostName = currentHost?.settings?.name;
    const currentUser = await Meteor.userAsync();
    const emailBody = getRegistrationEmailBody(
      theActivity,
      values,
      occurrence,
      currentHost,
      currentUser
    );

    try {
      await Registrations.insertAsync({
        host,
        occurrenceId: occurrence._id,
        activityId,
        ...rsvpValues,
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
    const occurrences = await getSortedOccurrences(activityId);
    const occurrence = occurrences[occurenceIndex];

    if (!occurrence) {
      throw new Meteor.Error('Occurrence not found');
    }

    const registrations = await getSortedRegistrations(occurrence._id);
    const registration = registrations[attendeeIndex];

    if (!registration) {
      throw new Meteor.Error('Registration not found');
    }

    const rsvpValues = {
      ...values,
      registerDate: new Date(),
    };

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const currentUser = await Meteor.userAsync();
    const emailBody = getRegistrationEmailBody(
      theActivity,
      rsvpValues,
      occurrence,
      currentHost,
      currentUser,
      true
    );

    try {
      await Registrations.updateAsync(registration._id, {
        $set: rsvpValues,
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
    const occurrences = await getSortedOccurrences(activityId);
    const occurrence = occurrences[occurenceIndex];

    if (!occurrence) {
      throw new Meteor.Error('Occurrence not found');
    }

    const registrations = await Registrations.find({
      occurrenceId: occurrence._id,
    }).fetchAsync();

    const theNonAttendee = registrations.find((a) => a.email === email);

    const idsToRemove = registrations
      .filter((a) => {
        if (theActivity.isGroupMeeting) {
          return a.email === email;
        }
        return a.email === email && a.lastName === lastName;
      })
      .map((a) => a._id);

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const hostName = currentHost.settings.name;

    try {
      if (idsToRemove.length > 0) {
        await Registrations.removeAsync({ _id: { $in: idsToRemove } });
      }
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
