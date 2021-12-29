import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { getHost } from '../@/shared';
import Hosts from '../@hosts/host';

Meteor.methods({

  createAccount(values) {
    check(values.email, String);
    check(values.username, String);
    check(values.password, String);

    try {
      const userId = Accounts.createUser(values);
      if (userId) {
        Meteor.call('sendWelcomeEmail', userId);
      }
      return userId;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  setSelfAsParticipant() {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (
      currentHost.members &&
      currentHost.members.some((member) => member.id === user._id)
    ) {
      throw new Meteor.Error('Host already does have you as a participant');
    }

    if (
      user.memberships &&
      user.memberships.some((membership) => membership.host === host)
    ) {
      throw new Meteor.Error('You are already a participant');
    }

    try {
      Hosts.update(
        { host: host },
        {
          $addToSet: {
            members: {
              username: user.username,
              id: user._id,
              email: user.emails[0].address,
              role: 'participant',
              date: new Date(),
            },
          },
        }
      );

      Meteor.users.update(user._id, {
        $addToSet: {
          memberships: {
            host,
            hostId: currentHost._id,
            role: 'participant',
            date: new Date(),
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  removeAsParticipant() {
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
      Hosts.update(currentHost._id, {
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

    try {
      Meteor.users.update(user._id, {
        $set: {
          firstName: values.firstName,
          lastName: values.lastName,
          bio: values.bio,
          contactInfo: values.contactInfo,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  setAvatar(avatar) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('Not allowed!');
    }

    const newAvatar = {
      src: avatar,
      date: new Date(),
    };

    try {
      Meteor.users.update(userId, {
        $set: {
          avatar: newAvatar,
        },
      });

      Works.update(
        {
          authorId: userId,
        },
        {
          $set: {
            authorAvatar: newAvatar,
          },
        },
        {
          multi: true,
        }
      );
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  getUserContactInfo(username) {
    try {
      const user = Meteor.users.findOne({ username });
      return user.contactInfo;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't retrieve the contact info");
    }
  },

  deleteAccount() {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('You are not a member anyways!');
    }
    try {
      Meteor.users.remove(userId);
      Hosts.find({ 'members.id': userId }).forEach((host) => {
        Hosts.update(host._id, { $pull: { members: { id: userId } } });
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },
});
