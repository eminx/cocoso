import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

import { getHost } from '../_utils/shared';
import Hosts from '../hosts/host';
import Works from '../works/work';
import Groups from '../groups/group';

const userModel = (user) => ({
  avatar: user.avatar,
  bio: user.bio,
  contactInfo: user.contactInfo,
  firstName: user.firstName,
  keywords: user.keywords,
  lastName: user.lastName,
  username: user.username,
  memberships: user.memberships,
});

Meteor.methods({
  async getCurrentUser() {
    return await Meteor.userAsync();
  },

  async getCurrentUserLang() {
    const user = await Meteor.userAsync();
    if (!user) {
      return null;
    }
    return user.lang;
  },

  async getUserInfo(username, hostPredefined) {
    check(username, String);
    const host = hostPredefined || getHost(this);

    const currentHost = await Hosts.findOneAsync({ host });
    const user = await Meteor.users.findOneAsync({ username });

    if (!user) {
      return null;
      // throw new Meteor.Error('User not found');
    }

    if (user._id === (await Meteor.userAsync()?._id)) {
      return userModel(user);
    }

    if (currentHost.isPortalHost && !user.isPublic) {
      return null;
      // throw new Meteor.Error('User not found');
    }

    if (!user.memberships.find((m) => m.host === host)?.isPublic) {
      return null;
      // throw new Meteor.Error('User not found');
    }

    return userModel(user);
  },

  async createAccount(values) {
    check(values.email, String);
    check(values.username, String);
    check(values.password, String);

    try {
      return await Accounts.createUserAsync(values);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async setSelfAsParticipant(hostToJoin) {
    const user = await Meteor.userAsync();
    if (!user) {
      return;
    }
    const host = hostToJoin || getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
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
      await Hosts.updateAsync(
        { host },
        {
          $addToSet: {
            members: {
              username: user.username,
              id: user._id,
              email: user.emails[0].address,
              role: 'participant',
              date: new Date(),
              isPublic: true,
              avatar: user.avatar?.src,
            },
          },
        }
      );

      await Meteor.users.updateAsync(user._id, {
        $addToSet: {
          memberships: {
            host,
            role: 'participant',
            date: new Date(),
            isPublic: true,
            hostname: currentHost.settings?.name,
          },
        },
      });

      await Meteor.callAsync('sendWelcomeEmail', user._id, host);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async removeAsParticipant() {
    const host = getHost(this);
    const user = await Meteor.userAsync();

    const currentHost = await Hosts.findOneAsync({ host });

    if (!currentHost.members.some((member) => member.id === user._id)) {
      throw new Meteor.Error(
        'Host already does not have you as a participant '
      );
    }

    if (!user.memberships.some((membership) => membership.host === host)) {
      throw new Meteor.Error('You are already not a participant');
    }

    try {
      await Hosts.updateAsync(currentHost._id, {
        $pull: {
          members: {
            id: user._id,
          },
        },
      });

      await Meteor.users.updateAsync(user._id, {
        $pull: {
          memberships: {
            host,
          },
        },
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async saveUserInfo(values) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      await Meteor.users.updateAsync(user._id, {
        $set: {
          ...values,
        },
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async setPreferredLanguage(lang) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      await Meteor.users.updateAsync(user._id, {
        $set: {
          lang,
        },
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async setAvatar(avatar) {
    const user = await Meteor.userAsync();

    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    if (!avatar) {
      throw new Meteor.Error('Not valid file');
    }

    const userId = user._id;

    const newAvatar = {
      src: avatar,
      date: new Date(),
    };

    try {
      await Meteor.users.updateAsync(userId, {
        $set: {
          avatar: newAvatar,
        },
      });

      await Hosts.updateAsync(
        {
          members: {
            $elemMatch: {
              id: userId,
            },
          },
        },
        {
          $set: {
            'members.$.avatar': avatar,
          },
        },
        {
          multi: true,
        }
      );

      await Works.updateAsync(
        {
          authorId: userId,
        },
        {
          $set: {
            authorAvatar: avatar,
          },
        },
        {
          multi: true,
        }
      );

      await Groups.updateAsync(
        {
          members: {
            $elemMatch: {
              memberId: userId,
            },
          },
        },
        {
          $set: {
            'members.$.avatar': avatar,
          },
        },
        {
          multi: true,
        }
      );

      await Groups.updateAsync(
        {
          authorId: userId,
        },
        {
          $set: {
            authorAvatar: avatar,
          },
        },
        {
          multi: true,
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async getUserContactInfo(username) {
    try {
      const user = await Meteor.users.findOneAsync({ username });
      return user?.contactInfo;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't retrieve the contact info");
    }
  },

  async setProfilePublicGlobally(isPublic) {
    check(isPublic, Boolean);
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }
    const userId = currentUser._id;

    try {
      await Meteor.users.updateAsync(
        {
          _id: userId,
        },
        {
          $set: {
            isPublic,
          },
        }
      );
      await Meteor.call('setProfilePublic', isPublic);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't update");
    }
  },

  async setProfilePublic(isPublic) {
    check(isPublic, Boolean);
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }
    const userId = currentUser._id;
    const host = getHost(this);

    try {
      await Meteor.users.updateAsync(
        {
          _id: userId,
          memberships: {
            $elemMatch: {
              host,
            },
          },
        },
        {
          $set: {
            'memberships.$.isPublic': isPublic,
          },
        }
      );
      await Hosts.updateAsync(
        {
          host,
          members: {
            $elemMatch: {
              id: userId,
            },
          },
        },
        {
          $set: {
            'members.$.isPublic': isPublic,
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't update");
    }

    // below turns off all the hosts
    // try {
    //   Meteor.users.update({ _id: userId }, { $set: { isPublic: isPublic } });
    //   Hosts.update(
    //     {
    //       members: {
    //         $elemMatch: {
    //           id: userId,
    //         },
    //       },
    //     },
    //     {
    //       $set: {
    //         'members.$.isPublic': isPublic,
    //       },
    //     },
    //     {
    //       multi: true,
    //     }
    //   );
    // } catch (error) {
    //   throw new Meteor.Error(error, "Couldn't update");
    // }
  },

  removeAvatar: () => {},

  async leaveHost() {
    const user = await Meteor.userAsync();
    const userId = user?._id;
    const host = getHost(this);

    if (!userId) {
      return;
    }

    try {
      await Meteor.users.updateAsync(userId, {
        $pull: {
          memberships: {
            host,
          },
        },
      });

      await Hosts.updateAsync(
        { host },
        {
          $pull: {
            members: {
              id: userId,
            },
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async resetUserPassword(email) {
    const host = getHost(this);
    Accounts.urls.resetPassword = function (token) {
      return `https://${host}/reset-password/${token}`;
    };
    // const currentHost = await Hosts.findOneAsync({ host });
    // Accounts.emailTemplates.siteName = currentHost.settings?.name;

    Accounts.emailTemplates.siteName = host;

    try {
      await Meteor.callAsync('forgotPassword', email);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async deleteAccount() {
    const currentUser = await Meteor.userAsync();
    const userId = currentUser?._id;
    if (!userId) {
      throw new Meteor.Error('You are not a member anyways!');
    }
    try {
      await Promise.all(
        Hosts.find({ 'members.id': userId })
          .fetch()
          .forEachAsync(async (host) => {
            await Hosts.updateAsync(host._id, {
              $pull: { members: { id: userId } },
            });
          })
      );
      await Meteor.users.removeAsync(userId);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
