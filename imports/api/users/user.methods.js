import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

import { getHost } from '../_utils/shared';
import Hosts from '../hosts/host';
import Works from '../works/work';
import Groups from '../groups/group';

Meteor.methods({
  getUserInfo(username, hostPredefined) {
    check(username, String);
    const host = hostPredefined || getHost(this);

    const currentHost = Hosts.findOne({ host });
    const user = Meteor.users.findOne({ username });
    if (!user) {
      throw new Meteor.Error('User not found');
    }

    if (currentHost.isPortalHost) {
      if (!user.isPublic) {
        return null;
        // throw new Meteor.Error('User not found');
      }
    } else if (
      (!user.isPublic && user._id !== Meteor.userId()) ||
      !user.memberships.find((m) => m.host === host).isPublic
    ) {
      return null;
      // throw new Meteor.Error('User not found');
    }

    return {
      avatar: user.avatar,
      bio: user.bio,
      contactInfo: user.contactInfo,
      firstName: user.firstName,
      keywords: user.keywords,
      lastName: user.lastName,
      username: user.username,
      memberships: user.memberships,
    };
  },

  createAccount(values) {
    check(values.email, String);
    check(values.username, String);
    check(values.password, String);

    try {
      const userId = Accounts.createUser(values);
      return userId;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  setSelfAsParticipant(hostToJoin) {
    const user = Meteor.user();
    if (!user) {
      return;
    }
    const host = hostToJoin || getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (currentHost.members && currentHost.members.some((member) => member.id === user._id)) {
      throw new Meteor.Error('Host already does have you as a participant');
    }

    if (user.memberships && user.memberships.some((membership) => membership.host === host)) {
      throw new Meteor.Error('You are already a participant');
    }

    try {
      Hosts.update(
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

      Meteor.users.update(user._id, {
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

      Meteor.call('sendWelcomeEmail', user._id, host);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  removeAsParticipant() {
    const host = getHost(this);
    const user = Meteor.user();

    const currentHost = Hosts.findOne({ host });

    if (!currentHost.members.some((member) => member.id === user._id)) {
      throw new Meteor.Error('Host already does not have you as a participant ');
    }

    if (!user.memberships.some((membership) => membership.host === host)) {
      throw new Meteor.Error('You are already not a participant');
    }

    try {
      Hosts.update(currentHost._id, {
        $pull: {
          members: {
            id: user._id,
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
          ...values,
        },
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  setPreferredLanguage(lang) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(user._id, {
        $set: {
          lang,
        },
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  setAvatar(avatar) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('Not allowed!');
    }

    if (!avatar) {
      throw new Meteor.Error('Not valid file');
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

      Hosts.update(
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

      Works.update(
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

      Groups.update(
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

      Groups.update(
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

  getUserContactInfo(username) {
    try {
      const user = Meteor.users.findOne({ username });
      return user?.contactInfo;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't retrieve the contact info");
    }
  },

  setProfilePublicGlobally(isPublic) {
    const userId = Meteor.userId();
    const host = getHost(this);

    try {
      Meteor.users.update(
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
            isPublic,
            'memberships.$.isPublic': isPublic,
          },
        }
      );
      Hosts.update(
        {
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
        },
        {
          multi: true,
        }
      );
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't update");
    }
  },

  setProfilePublic(isPublic) {
    const userId = Meteor.userId();
    const host = getHost(this);

    try {
      Meteor.users.update(
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
      Hosts.update(
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

  leaveHost() {
    const userId = Meteor.userId();
    const host = getHost(this);

    try {
      Meteor.users.update(userId, {
        $pull: {
          memberships: {
            host,
          },
        },
      });

      Hosts.update(
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

  resetUserPassword(email) {
    const host = getHost(this);
    Accounts.urls.resetPassword = function (token) {
      return `https://${host}/reset-password/${token}`;
    };
    // const currentHost = Hosts.findOne({ host });
    // Accounts.emailTemplates.siteName = currentHost.settings?.name;

    Accounts.emailTemplates.siteName = host;
    Meteor.call('forgotPassword', email, (respond, error) => {
      if (error) {
        console.log(error);
      }
    });
  },

  deleteAccount() {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('You are not a member anyways!');
    }
    try {
      Hosts.find({ 'members.id': userId }).forEach((host) => {
        Hosts.update(host._id, { $pull: { members: { id: userId } } });
      });
      Meteor.users.remove(userId);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
