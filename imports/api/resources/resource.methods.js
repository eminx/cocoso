import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';

import { isAdmin, isContributorOrAdmin } from '../users/user.roles';
import Hosts from '../hosts/host';
import Resources from './resource';
import Activities from '../activities/activity';

function validateLabel(label, host, resourceId) {
  // set resource query
  const resourceQuery = { host, label };
  if (resourceId) resourceQuery._id = { $ne: resourceId };
  // validate label
  if (label.length < 3) {
    throw new Meteor.Error(
      'Resource name is too short. Minimum 3 letters required'
    );
  } else if (Resources.find(resourceQuery).fetch().length > 0) {
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

    const currentHost = await Hosts.findOneAsync(
      { host },
      { fields: { members: 1 } }
    );
    if (!isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not valid user!');
    }

    try {
      const bookings = await Activities.find(
        {
          resourceId,
          authorId: user._id,
        },
        {
          fields: {
            title: 1,
            longDescription: 1,
            datesAndTimes: 1,
          },
        }
      ).fetchAsync();

      const userBookings = bookings.map((booking) => ({
        _id: booking._id,
        startDate: booking.datesAndTimes[0].startDate,
        startTime: booking.datesAndTimes[0].startTime,
        endDate: booking.datesAndTimes[0].endDate,
        endTime: booking.datesAndTimes[0].endTime,
        title: booking.title,
        description: booking.longDescription,
      }));

      return userBookings;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch bookings");
    }
  },

  async createResource(values) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync(
      { host },
      { fields: { members: 1 } }
    );
    if (!isAdmin(user, currentHost) || !validateLabel(values.label, host)) {
      return 'Not valid user or label!';
    }
    try {
      const newResourceId = await Resources.insert({
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
    const currentHost = newGroupIdHosts.findOneAsync(
      { host },
      { fields: { members: 1 } }
    );
    if (
      !isAdmin(user, currentHost) ||
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
        Resources.find({ host, 'resourcesForCombo._id': resource._id })
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
    const currentHost = await Hosts.findOneAsync(
      { host },
      { fields: { members: 1 } }
    );

    if (!isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed');
    }

    try {
      await Resources.removeAsync(resourceId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
