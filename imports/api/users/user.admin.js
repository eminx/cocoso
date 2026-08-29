import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';

import Hosts from '../hosts/host';
import { isAdmin, isContributorOrAdmin, isContributor } from './user.roles';
import Activities from '../activities/activity';
import Memberships from '../memberships/membership';

Meteor.methods({
  async setAsAdmin(memberId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const isAdminUser = await isAdmin(user._id, host);

    if (!user.isSuperAdmin && !isAdminUser) {
      throw new Meteor.Error('You are not allowed');
    }

    const memberMembership = await Memberships.findOneAsync({
      userId: memberId,
      host,
    });

    if (
      !memberMembership ||
      !['contributor', 'participant'].includes(memberMembership.role)
    ) {
      throw new Meteor.Error('User is does not have a role');
    }

    try {
      await Memberships.updateAsync(
        { userId: memberId, host },
        { $set: { role: 'admin' } }
      );
      await Meteor.users.updateAsync(memberId, {
        $set: {
          verifiedBy: {
            username: user.username,
            userId: user._id,
            date: new Date(),
          },
        },
      });
      await Hosts.updateAsync(
        { host },
        {
          $set: {
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

    if (!user.isSuperAdmin && !(await isContributorOrAdmin(user._id, host))) {
      throw new Meteor.Error('You are not allowed');
    }

    const memberMembership = await Memberships.findOneAsync({
      userId: memberId,
      host,
    });
    if (!memberMembership || memberMembership.role !== 'participant') {
      throw new Meteor.Error(
        error,
        'Some error occured... Sorry, your inquiry could not be done'
      );
    }

    try {
      await Memberships.updateAsync(
        { userId: memberId, host },
        { $set: { role: 'contributor' } }
      );
      await Meteor.users.updateAsync(memberId, {
        $set: {
          verifiedBy: {
            username: user.username,
            userId: user._id,
            date: new Date(),
          },
        },
      });
      await Hosts.updateAsync(
        { host },
        {
          $set: {
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

    const isAdminUser = await isAdmin(user._id, host);

    if (!user.isSuperAdmin && !isAdminUser) {
      throw new Meteor.Error('You are not allowed');
    }

    if (!(await isContributor(memberId, host))) {
      throw new Meteor.Error('User is not verified');
    }

    try {
      await Memberships.updateAsync(
        { userId: memberId, host },
        { $set: { role: 'participant' } }
      );
      await Meteor.users.updateAsync(memberId, {
        $set: {
          unVerifiedBy: {
            username: user.username,
            userId: user._id,
            date: new Date(),
          },
        },
      });
      await Hosts.updateAsync(
        { host },
        {
          $set: {
            unVerifiedBy: {
              username: user.username,
              userId: user._id,
              date: new Date(),
            },
          },
        }
      );

      // const currentHost = await Hosts.findOneAsync({ host });
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
    const isAdminUser = await isAdmin(user._id, host);

    if (!user.isSuperAdmin && !isAdminUser) {
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
      throw new Meteor.Error(error);
    }
  },

  async assignHostLogo(image) {
    const host = getHost(this);
    const user = await Meteor.userAsync();
    const isAdminUser = await isAdmin(user._id, host);

    if (!user.isSuperAdmin && !isAdminUser) {
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
    const isAdminUser = await isAdmin(user._id, host);

    if (!user.isSuperAdmin && !isAdminUser) {
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
    const isAdminUser = await isAdmin(user._id, host);

    if (!user.isSuperAdmin && !isAdminUser) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      return currentHost.emails;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async updateEmail(email, emailIndex) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const isAdminUser = await isAdmin(user._id, host);

    if (!user.isSuperAdmin && !isAdminUser) {
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

    if (!currentUser) {
      throw new Meteor.Error('You are not allowed');
    }

    const isAdminUser = await isAdmin(currentUser._id, host);

    if (!(await isContributorOrAdmin(currentUser._id, host))) {
      throw new Meteor.Error(
        'You can not create activities without being verified'
      );
    }
    if (userId !== currentUser._id && !isAdminUser) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      return await Activities.find({ authorId: userId, host }).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
