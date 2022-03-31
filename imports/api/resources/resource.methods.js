import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { getHost } from '../@/shared';
import { isContributorOrAdmin } from '../@users/user.roles';
import Hosts from '../@hosts/host';
import Resources from './resource';
import { compareForSort } from '../processes/process.helpers';

// RESOURCE METHOD VALIDATIONS
function validateUser(user, currentHost) {
  if (!user || !isContributorOrAdmin(user, currentHost)) {
    throw new Meteor.Error('You are not allowed');
  }
  return true;
}
function validateLabel(label, host, resourceId) {
  // set resource query
  let resourceQuery = { host, label };
  if (resourceId) resourceQuery._id = { $ne: resourceId };
  // validate label
  if (label.length < 3) {
    throw new Meteor.Error('Resource name is too short. Minimum 3 letters required');
  } else if (Resources.find(resourceQuery).fetch().length > 0) {
    throw new Meteor.Error('There already is a resource with this name');
  }
  return true;
}
// FETCH COMBO RESOURCES
function fetchComboResources(resource) {
  const resourcesForCombo =  Resources.find(
    { _id : { $in : resource.resourcesForCombo } }, 
    { fields: { label: 1 } }
  ).fetch();
  resource.resourcesForCombo = resourcesForCombo;
  return resource;
}
// RESOURCE METHODS
Meteor.methods({
  getResources() {
    const host = getHost(this);
    const sort = { createdAt: -1 };
    const fields = Resources.publicFields;
    const resources = Resources.find({ host }, { sort, fields }).fetch();
    resources.forEach(resource => {
      if (resource.isCombo) 
        resource = fetchComboResources(resource);
    });
    resources.forEach(resource => {
      if (resource.userId) {
        resource.user = {} = Meteor.users.findOne(resource.userId, { fields: { username: 1, avatar: { src: 1 } }});
        resource.user.avatar = resource.user.avatar.src;
        delete resource.userId;
      }
    });
    return resources;
  },

  getResourceLabels() {
    const host = getHost(this);
    const sort = { createdAt: -1 };
    const fields = { label: 1 };
    return Resources.find({ host }, { sort, fields }).fetch();
  },

  getResourceById(resourceId) {
    const fields = Resources.publicFields;
    let resource = Resources.findOne(resourceId, { fields });
    if (resource && resource.isCombo) resource = fetchComboResources(resource);
    if (resource.userId) {
      resource.user = {} = Meteor.users.findOne(resource.userId, { fields: { username: 1, avatar: { src: 1 } }});
      resource.user.avatar = resource.user.avatar.src;
      delete resource.userId;
    }
    return resource;
  },

  createResource(values) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host }, { fields: { members: 1 }});
    const resourceIndex = Resources.find({ host }).count();
    if(validateUser(user, currentHost) && validateLabel(values.label, host)) {
      try {
        return Resources.insert({
          host,
          userId: user._id,
          ...values,
          resourceIndex,
          createdBy: user.username,
          createdAt: new Date(),
        });
      } catch (error) {
        throw new Meteor.Error(error);
      }
    }
  },

  updateResource(resourceId, values) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host }, { fields: { members: 1 }});
    if(validateUser(user, currentHost) && validateLabel(values.label, host, resourceId)) {
      try {
        Resources.update(resourceId, {
          $set: {
            ...values,
            updatedBy: user.username,
            updatedAt: new Date(),
          },
        });
      } catch (error) {
        throw new Meteor.Error(error, "Couldn't add to Collection");
      }
    }
  },

  deleteResource(resourceId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host }, { fields: { members: 1 }});
    if(validateUser(user, currentHost)) {
      try {
        Resources.remove(resourceId);
      } catch (error) {
        throw new Meteor.Error(error, "Couldn't remove from collection");
      }
    }
  },

  // getBookings(resourceId) {
  //   const resource = Resources.findOne(resourceId, { fields: { bookings: 1 } });
  //   if (resource.bookings) return resource.bookings;
  //   else return [];
  // },

  // createBooking(resourceId, values) {
  //   const user = Meteor.user();
  //   const host = getHost(this);
  //   const currentHost = Hosts.findOne({ host }, { fields: { members: 1 }});
    
  //   values = { 
  //     _id: Random.id(),
  //     ...values, 
  //     userId: user?._id, 
  //     bookedBy: user?.username, 
  //     bookedAt: new Date() 
  //   }

  //   if (!user || !isContributorOrAdmin(user, currentHost)) {
  //     throw new Meteor.Error('Not allowed!');
  //   }

  //   const theResources = Resources.findOne(resourceId, { fields: { bookings: 1 }});
  //   let bookings = [ ];
  //   if (theResources.bookings) bookings = [ ...theResources.bookings, values ];
  //   else bookings = [ values ];
  //   const sortedBookings = bookings.sort(compareForSort);

  //   try {
  //     Resources.update(resourceId, {
  //       $set: {
  //         bookings: sortedBookings,
  //       },
  //     });
  //     return values;
  //   } catch (error) {
  //     throw new Meteor.Error('Could not create the meeting due to:', error.reason);
  //   }
  // },

  // deleteBooking(resourceId, bookingId) {
  //   const user = Meteor.user();
  //   const host = getHost(this);
  //   const currentHost = Hosts.findOne({ host }, { fields: { members: 1 }});
  //   if(validateUser(user, currentHost)) {
  //     try {
  //       Resources.update(resourceId, { $pull: { bookings: { _id: bookingId }}});
  //     } catch (error) {
  //       throw new Meteor.Error(error, "Couldn't remove from collection");
  //     }
  //   }
  // }

});