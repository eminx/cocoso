import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';

import Hosts from '../hosts/host';
import { isContributorOrAdmin, isContributor } from './user.roles';
import Activities from '../activities/activity';

const isUserAdmin = (members, userId) =>
  members.some((member) => member.id === userId && member.role === 'admin');

Meteor.methods({
  async setAsAdmin(memberId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const member = await Meteor.users.findOneAsync(memberId);

    if (
      !member.memberships ||
      !member.memberships.some(
        (membership) =>
          membership.host === host &&
          ['contributor', 'participant'].includes(membership.role)
      )
    ) {
      throw new Meteor.Error('User is does not have a role');
    }

    try {
      await Meteor.users.updateAsync(
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
      await Hosts.updateAsync(
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
      await Meteor.callAsync('sendNewAdminEmail', memberId);
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  async setAsContributor(memberId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user.isSuperAdmin && !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('You are not allowed');
    }

    const member = await Meteor.users.findOneAsync(memberId);
    if (
      !member ||
      !member.memberships ||
      !member.memberships.some(
        (membership) =>
          membership.host === host && membership.role === 'participant'
      )
    ) {
      throw new Meteor.Error(
        error,
        'Some error occured... Sorry, your inquiry could not be done'
      );
    }

    try {
      await Meteor.users.updateAsync(
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
      await Hosts.updateAsync(
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
      await Meteor.callAsync('sendNewContributorEmail', memberId);
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  async setAsParticipant(memberId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);

    const currentHost = await Hosts.findOneAsync({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const member = await Meteor.users.findOneAsync(memberId);

    if (!isContributor(member, currentHost)) {
      throw new Meteor.Error('User is not verified');
    }

    try {
      await Meteor.users.updateAsync(
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
      await Hosts.updateAsync(
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
      // Meteor.callAsync(
      //   'sendEmail',
      //   memberId,
      //   `You are removed from ${hostName} as a verified member`,
      //   `Hi,\n\nWe're sorry to inform you that you're removed as an active member at ${currentHost.name}. You are, however, still welcome to participate to the events and groups here.\n\n For questions, please contact the admin.\n\nKind regards,\n${currentHost.name} Team`
      // );
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  async updateHostSettings(newSettings) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      await Hosts.updateAsync(
        { host },
        {
          $set: {
            settings: { ...currentHost.settings, ...newSettings },
          },
        }
      );
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  async assignHostLogo(image) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      await Hosts.updateAsync(
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

  async setMainColor(colorHSL) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const settings = currentHost.settings;
    const newSettings = {
      ...settings,
      mainColor: colorHSL,
    };

    try {
      await Hosts.updateAsync(
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

  async getEmails() {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      return currentHost.emails;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async updateEmail(emailIndex, email) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const newEmails = [...currentHost.emails];

    newEmails[emailIndex] = email;

    try {
      await Hosts.updateAsync(
        { host },
        {
          $set: {
            emails: newEmails,
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async getActivitiesbyUserId(userId) {
    const currentUser = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const isAdmin =
      currentHost && isUserAdmin(currentHost.members, currentUser._id);

    if (!currentUser) {
      throw new Meteor.Error('You are not allowed');
    }
    if (!isContributorOrAdmin(currentUser, currentHost)) {
      throw new Meteor.Error(
        'You can not create activities without being verified'
      );
    }
    if (userId !== currentUser._id && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      return await Activities.find({ authorId: userId, host }).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
