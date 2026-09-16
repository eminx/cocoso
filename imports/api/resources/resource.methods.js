import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';

import { isAdmin, isContributorOrAdmin } from '../users/user.roles';
import Resources from './resource';
import Activities from '../activities/activity';
import Occurrences from '../occurrences/occurrence';

async function validateLabel(label, host, resourceId) {
  // set resource query
  const resourceQuery = { host, label };
  if (resourceId) resourceQuery._id = { $ne: resourceId };
  // validate label
  if (label.length < 3) {
    throw new Meteor.Error(
      'Resource name is too short. Minimum 3 letters required'
    );
  } else if ((await Resources.find(resourceQuery).fetchAsync().length) > 0) {
    throw new Meteor.Error('There already is a resource with this name');
  }
  return true;
}

// RESOURCE METHODS
Meteor.methods({
  async getResourcesFromAllHosts() {
    const fields = Resources.publicFields;
    const sort = { createdAt: -1 };
    return await Resources.find({}, { fields, sort }).fetchAsync();
  },

  async getResources(hostPredefined) {
    const host = hostPredefined || getHost(this);

    const fields = Resources.publicFields;
    return await Resources.find(
      { host },
      {
        fields,
        sort: { createdAt: -1 },
      }
    ).fetchAsync();
  },

  async getResourcesDry(hostPredefined) {
    const host = hostPredefined || getHost(this);

    return await Resources.find(
      { host },
      {
        fields: {
          _id: 1,
          host: 1,
          label: 1,
          isBookable: 1,
          isCombo: 1,
          resourcesForCombo: 1,
        },
        sort: { createdAt: -1 },
      }
    ).fetchAsync();
  },

  async getResourceById(resourceId) {
    const fields = Resources.publicFields;
    return await Resources.findOneAsync(resourceId, { fields });
  },

  async getResourceBookingsForUser(resourceId, hostPredefined) {
    const user = await Meteor.userAsync();
    const host = hostPredefined || getHost(this);

    if (!(await isContributorOrAdmin(user._id, host))) {
      throw new Meteor.Error('Not valid user!');
    }

    try {
      const bookings = await Activities.find(
        { resourceId, authorId: user._id },
        { fields: { title: 1, longDescription: 1 } }
      ).fetchAsync();

      const activityIds = bookings.map((booking) => booking._id);
      const occurrences = activityIds.length
        ? await Occurrences.find({
            activityId: { $in: activityIds },
          }).fetchAsync()
        : [];

      // One row per booking, using its earliest occurrence — matches the
      // original behavior, which always read datesAndTimes[0] off an array
      // both admin forms already save in ascending date order.
      const earliestOccurrenceByActivity = new Map();
      occurrences.forEach((occ) => {
        const current = earliestOccurrenceByActivity.get(occ.activityId);
        if (!current || occ.startDateTime < current.startDateTime) {
          earliestOccurrenceByActivity.set(occ.activityId, occ);
        }
      });

      return bookings
        .map((booking) => {
          const occurrence = earliestOccurrenceByActivity.get(booking._id);
          if (!occurrence) {
            return null;
          }
          return {
            _id: booking._id,
            startDate: occurrence.startDate,
            startTime: occurrence.startTime,
            endDate: occurrence.endDate,
            endTime: occurrence.endTime,
            title: booking.title,
            description: booking.longDescription,
          };
        })
        .filter(Boolean);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch bookings");
    }
  },

  async createResource(values) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    if (
      !(await isAdmin(user._id, host)) ||
      (await !validateLabel(values.label, host))
    ) {
      return 'Not valid user or label!';
    }
    try {
      const newResourceId = await Resources.insertAsync({
        ...values,
        host,
        userId: user._id,
        createdBy: user.username,
        createdAt: new Date(),
      });
      await Meteor.callAsync(
        'createChat',
        values.label,
        newResourceId,
        'resources'
      );
      return newResourceId;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async updateResource(resourceId, values) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    if (
      !(await isAdmin(user._id, host)) ||
      !validateLabel(values.label, host, resourceId)
    ) {
      throw new Meteor.Error('Not allowed');
    }

    const resource = await Resources.findOneAsync(resourceId);

    try {
      await Resources.updateAsync(resourceId, {
        $set: {
          ...values,
          updatedBy: user.username,
          updatedAt: new Date(),
        },
      });
      if (
        !resource.isCombo &&
        (await Resources.findOneAsync({
          host,
          'resourcesForCombo._id': resource._id,
        }))
      ) {
        await Resources.updateAsync(
          { host, 'resourcesForCombo._id': resource._id },
          {
            $set: {
              'resourcesForCombo.$.label': values.label,
            },
          },
          {
            multi: true,
          }
        );
      }
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  async deleteResource(resourceId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);

    if (!(await isAdmin(user._id, host))) {
      throw new Meteor.Error('Not allowed');
    }

    try {
      await Resources.removeAsync(resourceId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
