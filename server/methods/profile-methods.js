import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { getHost } from './shared';
import { Hosts } from '../../lib/collections';

Meteor.methods({
  createAccount(values) {
    check(values.email, String);
    check(values.username, String);
    check(values.password, String);
    try {
      const userId = Accounts.createUser(values);
      const user = {
        username: values.username,
        email: values.email,
        id: userId,
      };
      Meteor.call('setAsParticipant');
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  setAsParticipant() {
    const host = getHost(this);
    const user = Meteor.user();

    const currentHost = Hosts.findOne({ host });

    if (currentHost.members.some((member) => member.id === user._id)) {
      throw new Meteor.Error('Host already does have you as a participant');
    }

    if (user.memberships.some((membership) => membership.host === host)) {
      throw new Meteor.Error('You are already a participant');
    }

    try {
      Hosts.update(host._id, {
        $addToSet: {
          members: {
            username: user.username,
            id: user._id,
            avatar: user.avatar,
            date: new Date(),
          },
        },
      });

      Meteor.users.update(user._id, {
        $addToSet: {
          memberships: {
            host,
            hostId: host._id,
            date: new Date(),
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  rmeoveAsParticipant() {
    const host = getHost(this);
    const user = Meteor.user();

    const currentHost = Hosts.findOne({ host });

    if (!currentHost.members.some((member) => member.id === user._id)) {
      throw new Meteor.Error(
        'Host already does not have you as a participant '
      );
    }

    if (!user.memberships.some((membership) => membership.host === host)) {
      throw new Meteor.Error('You are already not a participant');
    }

    try {
      Hosts.update(host._id, {
        $pull: {
          members: {
            username: user.username,
          },
        },
      });

      Meteor.users.update(user._id, {
        $pull: {
          memberships: {
            host,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  saveUserInfo(values) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    check(values.firstName, String);
    check(values.lastName, String);
    check(values.bio, String);

    try {
      Meteor.users.update(user._id, {
        $set: {
          firstName: values.firstName,
          lastName: values.lastName,
          bio: values.bio,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  setAvatar(avatar) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(user._id, {
        $set: {
          avatar: {
            src: avatar,
            date: new Date(),
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  deleteAccount() {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('You are not a member anyways!');
    }
    try {
      Meteor.users.remove(userId);
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },
});
