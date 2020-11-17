import { Meteor } from 'meteor/meteor';

const publicSettings = Meteor.settings.public;
const contextName = publicSettings.contextName;

import { getHost, isContributorOrAdmin } from './shared';

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

const isUserAdmin = (members, userId) => {
  return members.some(
    (member) => member.id === userId && member.role === 'admin'
  );
};

Meteor.methods({
  getUsers() {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host: host });

    if (!user.isSuperAdmin && !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('You are not allowed');
    }
    return currentHost.members;
  },

  setAsAdmin(memberId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host: host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const member = Meteor.users.findOne(memberId);

    if (
      !member.memberships ||
      !member.memberships.some((membership) => {
        return (
          membership.host === host &&
          ['contributor', 'participant'].includes(membership.role)
        );
      })
    ) {
      throw new Meteor.Error('User is not a participant or contributor');
    }

    try {
      Meteor.users.update(
        {
          _id: memberId,
          'memberships.host': host,
        },
        {
          $set: {
            'memberships.$.role': 'admin',
            verifiedBy: {
              username: user.username,
              userId: user._id,
              date: new Date(),
            },
          },
        }
      );
      Hosts.update(
        { _id: currentHost._id, 'members.id': memberId },
        {
          $set: {
            'members.$.role': 'admin',
            verifiedBy: {
              username: user.username,
              userId: user._id,
              date: new Date(),
            },
          },
        }
      );
      // Meteor.call(
      //   'sendEmail',
      //   memberId,
      //   `You are now a verified member at ${contextName}`,
      //   getVerifiedEmailText(member.username)
      // );
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  setAsContributor(memberId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host: host });

    if (!user.isSuperAdmin && !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('You are not allowed');
    }

    const member = Meteor.users.findOne(memberId);

    if (
      !member.memberships ||
      !member.memberships.some((membership) => {
        return membership.host === host && membership.role === 'participant';
      })
    ) {
      throw new Meteor.Error('User is not a participant');
    }

    try {
      Meteor.users.update(
        {
          _id: memberId,
          'memberships.host': host,
        },
        {
          $set: {
            'memberships.$.role': 'contributor',
            verifiedBy: {
              username: user.username,
              userId: user._id,
              date: new Date(),
            },
          },
        }
      );
      Hosts.update(
        { _id: currentHost._id, 'members.id': memberId },
        {
          $set: {
            'members.$.role': 'contributor',
            verifiedBy: {
              username: user.username,
              userId: user._id,
              date: new Date(),
            },
          },
        }
      );
      // Meteor.call(
      //   'sendEmail',
      //   memberId,
      //   `You are now a verified member at ${contextName}`,
      //   getVerifiedEmailText(member.username)
      // );
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  setAsParticipant(memberId) {
    const user = Meteor.user();
    const host = getHost(this);

    const currentHost = Hosts.findOne({ host: host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const member = Meteor.users.findOne(memberId);
    isMemberAdmin = isUserAdmin(currentHost.members, member._id);
    if (member.isSuperAdmin || isMemberAdmin) {
      throw new Meteor.Error('You can not unverify an admin');
    }

    try {
      Meteor.users.update(
        { _id: memberId, 'memberships.host': host },
        {
          $set: {
            'memberships.$.role': 'participant',
            unVerifiedBy: {
              username: user.username,
              userId: user._id,
              date: new Date(),
            },
          },
        }
      );
      Hosts.update(
        { _id: currentHost._id, 'members.id': memberId },
        {
          $set: {
            'members.$.role': 'participant',
            unVerifiedBy: {
              username: user.username,
              userId: user._id,
              date: new Date(),
            },
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
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

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
    const host = getHost(this);
    if (!user) {
      throw new Meteor.Error('You are not allowed');
    }

    return Categories.find({
      host,
    }).fetch();
  },

  addNewCategory(category, type) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    if (Categories.findOne({ label: category.toLowerCase(), host })) {
      throw new Meteor.Error('Category already exists!');
    }

    const catLength = Categories.find({ host, type }).count();

    try {
      return Categories.insert({
        host,
        type,
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
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      Categories.remove(categoryId);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  assignHostLogo(image) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }
    try {
      Hosts.update(
        { host },
        {
          $set: {
            logo: image,
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
