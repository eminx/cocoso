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
    throw new Meteor.Error('Resource name is too short. Minimum 3 letters required');
  } else if (Resources.find(resourceQuery).fetch().length > 0) {
    throw new Meteor.Error('There already is a resource with this name');
  }
  return true;
}

// RESOURCE METHODS
Meteor.methods({
  getResourcesFromAllHosts() {
    const fields = Resources.publicFields;
    const sort = { createdAt: -1 };
    return Resources.find({}, { fields, sort }).fetch();
  },

  getResources(hostPredefined) {
    const host = hostPredefined || getHost(this);

    const fields = Resources.publicFields;
    return Resources.find(
      { host },
      {
        fields,
        sort: { createdAt: -1 },
      }
    ).fetch();
  },

  getResourcesDry(hostPredefined) {
    const host = hostPredefined || getHost(this);

    return Resources.find(
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
    ).fetch();
  },

  getResourceById(resourceId) {
    const fields = Resources.publicFields;
    return Resources.findOne(resourceId, { fields });
  },

  getResourceBookingsForUser(resourceId, hostPredefined) {
    const user = Meteor.user();
    const host = hostPredefined || getHost(this);

    const currentHost = Hosts.findOne({ host }, { fields: { members: 1 } });
    if (!isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not valid user!');
    }

    try {
      const bookings = Activities.find(
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
      ).fetch();

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

  createResource(values) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host }, { fields: { members: 1 } });
    if (!isAdmin(user, currentHost) || !validateLabel(values.label, host)) {
      return 'Not valid user or label!';
    }
    try {
      const newResourceId = Resources.insert(
        {
          ...values,
          host,
          userId: user._id,
          createdBy: user.username,
          createdAt: new Date(),
        },
        () => {
          Meteor.call('createChat', values.label, newResourceId, 'resources', (error) => {
            if (error) {
              console.log('Chat is not created due to error: ', error);
            }
          });
        }
      );
      return newResourceId;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  updateResource(resourceId, values) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host }, { fields: { members: 1 } });
    if (!isAdmin(user, currentHost) || !validateLabel(values.label, host, resourceId)) {
      throw new Meteor.Error('Not allowed');
    }

    const resource = Resources.findOne(resourceId);

    try {
      Resources.update(resourceId, {
        $set: {
          ...values,
          updatedBy: user.username,
          updatedAt: new Date(),
        },
      });
      if (!resource.isCombo && Resources.find({ host, 'resourcesForCombo._id': resource._id })) {
        Resources.update(
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

  deleteResource(resourceId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host }, { fields: { members: 1 } });

    if (!isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed');
    }

    try {
      Resources.remove(resourceId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
