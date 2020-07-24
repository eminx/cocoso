import { Meteor } from 'meteor/meteor';
// import { Hosts } from '../../lib/collections';

const publicSettings = Meteor.settings.public;
const contextName = publicSettings.contextName;

import { getHost } from './shared';

const getVerifiedEmailText = (username) => {
  return `Hi ${username},\n\nWe're very happy to inform you that you are now a verified member at ${contextName}.\n\nThis means that from now on you're welcome to create your own study processes and book spaces & tools either for your own projects or to make a public event. We would like to encourage you to use this tool and wish you to keep a good collaboration with your team.\n\nKind regards,\n${contextName} Team`;
};

const catColors = [
  'hsla(10, 62%, 80%, 0.7)',
  'hsla(46, 62%, 80%, 0.7)',
  'hsla(82, 62%, 80%, 0.7)',
  'hsla(118, 62%, 80%, 0.7)',
  'hsla(154, 62%, 80%, 0.7)',
  'hsla(190, 62%, 80%, 0.7)',
  'hsla(226, 62%, 80%, 0.7)',
  'hsla(262, 62%, 80%, 0.7)',
  'hsla(298, 62%, 80%, 0.7)',
  'hsla(334, 62%, 80%, 0.7)',
];

const isHostAdmin = (host, userId) => {
  console.log(host);
  const currentHost = Hosts.findOne({ host: host });
  return currentHost.admins.some((admin) => admin.id === userId);
};

Meteor.methods({
  getUsers() {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host: host });
    const isAdmin = currentHost.admins.some((admin) => admin.id === user._id);
    console.log(currentHost, isAdmin, host);

    if (!user.isSuperAdmin || !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }
    console.log(currentHost);
    return currentHost.members;
  },

  verifyMember(memberId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host: host });
    const isAdmin = currentHost.admins.some((admin) => admin.id === user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const verifiedUser = Meteor.users.findOne(memberId);

    try {
      Meteor.users.update(memberId, {
        $addToSet: {
          memberships: {
            host,
            hostId: currentHost._id,
            verifiedBy: {
              id: user._id,
              username: user.username,
            },
            role: 'contributor',
            date: new Date(),
          },
        },
      });
      Hosts.update(currentHost._id, {
        $addToSet: {
          members: {
            username: verifiedUser.username,
            id: verifiedUser._id,
            email: verifiedUser.emails[0].address,
            role: 'contributor',
            date: new Date(),
          },
        },
      });
      // Meteor.call(
      //   'sendEmail',
      //   memberId,
      //   `You are now a verified member at ${contextName}`,
      //   getVerifiedEmailText(verifiedUser.username)
      // );
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  unVerifyMember(memberId) {
    const user = Meteor.user();
    const host = getHost(this);

    const currentHost = Hosts.findOne({ host: host });
    const isAdmin = currentHost.admins.some((admin) => admin.id === user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const theOtherUser = Meteor.users.findOne(memberId);
    isMemberAdmin = currentHost.admins.some((admin) => admin.id === memberId);
    if (theOtherUser.isSuperAdmin || isMemberAdmin) {
      throw new Meteor.Error('You can not unverify an admin');
    }

    try {
      Meteor.users.updateOne(
        { _id: memberId, 'memberships.$.host': host },
        {
          $set: {
            'memberships.$.role': 'participant',
          },
        }
      );
      Hosts.updateOne(
        { _id: currentHost._id, 'members.$.username': user.username },
        {
          $set: {
            'members.$.role': 'participant',
          },
        }
      );

      // const currentHost = Hosts.findOne({ host });
      // const hostName = currentHost.settings.name;
      // Meteor.call(
      //   'sendEmail',
      //   memberId,
      //   `You are removed from ${hostName} as a verified member`,
      //   `Hi,\n\nWe're sorry to inform you that you're removed as an active member at ${currentHost.name}. You are, however, still welcome to participate to the events and processes here.\n\n For questions, please contact the admin.\n\nKind regards,\n${currentHost.name} Team`
      // );
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  getHostSettings() {
    const host = getHost(this);

    try {
      const currentHost = Hosts.findOne({ host });
      return currentHost.settings;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  updateHostSettings(newSettings) {
    const user = Meteor.user();
    if (!user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const host = getHost(this);

    try {
      Hosts.update(
        { host },
        {
          $set: {
            settings: newSettings,
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getCategories() {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed');
    }

    return Categories.find().fetch();
  },

  addNewCategory(category) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const isAdmin = currentHost.admins.some((admin) => admin.id === user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    if (Categories.findOne({ label: category.toLowerCase() })) {
      throw new Meteor.Error('Category already exists!');
    }

    const catLength = Categories.find().count();

    try {
      return Categories.insert({
        host: currentHost.host,
        label: category.toLowerCase(),
        color: catColors[catLength],
        addedBy: user._id,
        addedUsername: user.username,
        addedDate: new Date(),
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  removeCategory(categoryId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const isAdmin = currentHost.admins.some((admin) => admin.id === user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      Categories.remove(categoryId);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
