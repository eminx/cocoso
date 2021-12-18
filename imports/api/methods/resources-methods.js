import { Meteor } from 'meteor/meteor';
import { getHost, isContributorOrAdmin } from '../@/shared';

Meteor.methods({
  getResources() {
    const host = getHost(this);

    return Resources.find({ host }, { sort: { creationDate: 1 } }).fetch();
  },

  createResource(values) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const resources = Resources.find({ host }).fetch();
    if (
      resources.some(
        (resource) =>
          resource.label.toLowerCase() === values.label.toLowerCase()
      )
    ) {
      throw new Meteor.Error('There already is a resource with this name');
    }
    if (values.label.length < 3) {
      throw new Meteor.Error(
        'Resource name is too short. Minimum 3 letters required'
      );
    }

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      const newResourceId = Resources.insert({
        ...values,
        labelLowerCase: values.label.toLowerCase(),
        resourceIndex: resources.length,
        host,
        authorId: user._id,
        authorAvatar: user.avatar || '',
        authorUsername: user.username,
        authorFirstName: user.firstName,
        authorLastName: user.lastName,
        creationDate: new Date(),
      });
      return newResourceId;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  updateResource(resourceId, values) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const labelAlreadyExists = Resources.findOne({
      host,
      _id: { $ne: resourceId },
      labelLowerCase: values.label.toLowerCase(),
    });

    if (labelAlreadyExists) {
      throw new Meteor.Error('There already is a resource with this name');
    } else if (values.label.length < 3) {
      throw new Meteor.Error(
        'Resource name is too short. Minimum 3 letters required'
      );
    } else if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      Resources.update(resourceId, {
        $set: {
          ...values,
          labelLowerCase: values.label.toLowerCase(),
          updatedBy: user.username,
          latestUpdate: new Date(),
        },
      });
      return values.label;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  deleteResource(resourceId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      Resources.remove(resourceId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },
});
