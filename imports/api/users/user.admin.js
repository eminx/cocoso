import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';

import Hosts from '../hosts/host';
import { isContributorOrAdmin, isContributor } from './user.roles';

const isUserAdmin = (members, userId) =>
  members.some((member) => member.id === userId && member.role === 'admin');

Meteor.methods({
  setAsAdmin(memberId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const member = Meteor.users.findOne(memberId);

    if (
      !member.memberships ||
      !member.memberships.some(
        (membership) =>
          membership.host === host && ['contributor', 'participant'].includes(membership.role)
      )
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
      Meteor.call('sendNewAdminEmail', memberId);
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  setAsContributor(memberId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user.isSuperAdmin && !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('You are not allowed');
    }

    const member = Meteor.users.findOne(memberId);
    if (
      !member ||
      !member.memberships ||
      !member.memberships.some(
        (membership) => membership.host === host && membership.role === 'participant'
      )
    ) {
      throw new Meteor.Error('Some error occured... Sorry, your inquiry could not be done');
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
      Meteor.call('sendNewContributorEmail', memberId);
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  setAsParticipant(memberId) {
    const user = Meteor.user();
    const host = getHost(this);

    const currentHost = Hosts.findOne({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const member = Meteor.users.findOne(memberId);

    if (!isContributor(member, currentHost)) {
      throw new Meteor.Error('User is not a contributor');
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

  setMainColor(colorHSL) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
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

  getEmails() {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
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

  updateEmail(emailIndex, email) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    const newEmails = [...currentHost.emails];

    newEmails[emailIndex] = email;

    try {
      Hosts.update(
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
});
