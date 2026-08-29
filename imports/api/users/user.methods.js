import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

import { getHost } from '../_utils/shared';
import Hosts from '../hosts/host';
import Platform from '../platform/platform';
import Works from '../works/work';
import Groups from '../groups/group';
import DirectMessages from '../directMessages/directMessage';
import Memberships from '../memberships/membership';
import { getUserMemberships } from '../memberships/membership.helpers';

const userModel = async (user) => ({
  _id: user._id,
  avatar: user.avatar,
  bio: user.bio,
  contactInfo: user.contactInfo,
  firstName: user.firstName,
  keywords: user.keywords,
  lastName: user.lastName,
  username: user.username,
  memberships: await getUserMemberships(user._id),
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
    }

    if (currentHost.isPortalHost) {
      if (user.isPublic) {
        return await userModel(user);
      } else {
        return null;
      }
    }

    const currentUser = await Meteor.userAsync();

    if (user._id === currentUser?._id) {
      return await userModel(user);
    }

    const membership = await Memberships.findOneAsync({
      userId: user._id,
      host,
    });
    if (!membership?.isPublic) {
      return null;
    }

    return await userModel(user);
  },

  async createAccount(values) {
    check(values.email, String);
    check(values.username, String);
    check(values.password, String);

    const userExists = await Accounts.findUserByUsername(values.username);

    if (userExists) {
      throw new Meteor.Error({ reason: 'Username is taken' });
      return;
    }

    try {
      return await Accounts.createUserAsync(values);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async isUsernameUnique(username) {
    check(username, String);
    if (username.length < 4) {
      return;
    }
    const usernameExists = await Accounts.findUserByUsername(username);
    return Boolean(usernameExists);
  },

  async setSelfAsParticipant(hostToJoin) {
    const user = await Meteor.userAsync();
    if (!user) {
      return;
    }
    const host = hostToJoin || getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    if (!currentHost) {
      throw new Meteor.Error('Host not found');
    }

    const existingMembership = await Memberships.findOneAsync({
      userId: user._id,
      host,
    });
    if (existingMembership) {
      throw new Meteor.Error('You are already a participant');
    }

    try {
      await Memberships.insertAsync({
        userId: user._id,
        host,
        role: 'participant',
        date: new Date(),
        isPublic: true,
      });

      await Meteor.callAsync('sendWelcomeEmail', user._id, host);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async removeAsParticipant() {
    const host = getHost(this);
    const user = await Meteor.userAsync();

    const membership = await Memberships.findOneAsync({
      userId: user._id,
      host,
    });

    if (!membership) {
      throw new Meteor.Error('You are already not a participant');
    }

    try {
      await Memberships.removeAsync({ userId: user._id, host });
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

      await DirectMessages.updateAsync(
        {
          participantIds: {
            $elemMatch: {
              $eq: userId,
            },
          },
        },
        {
          $set: {
            'participantAvatars.$': avatar.replace('full', 'thumb'),
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
      await Memberships.updateAsync(
        { userId, host },
        { $set: { isPublic } }
      );
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't update");
    }
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
      await Memberships.removeAsync({ userId, host });
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
      await Memberships.removeAsync({ userId });

      Meteor.defer(async () => {
        Meteor.setTimeout(async () => {
          await Meteor.users.removeAsync(userId);
        }, 60000);
      });

      return true;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  async saveEncryptionKeys({ publicKey, encryptedPrivateKey, keySalt }) {
    check(publicKey, String);
    check(encryptedPrivateKey, String);
    check(keySalt, String);

    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('not-authorized');
    }

    await Meteor.users.updateAsync(user._id, {
      $set: { publicKey, encryptedPrivateKey, keySalt },
    });
  },

  async getEncryptionKeyBackup() {
    const user = await Meteor.userAsync();
    if (!user) throw new Meteor.Error('not-authorized');
    const doc = await Meteor.users.findOneAsync(user._id, {
      fields: { publicKey: 1, encryptedPrivateKey: 1, keySalt: 1 },
    });
    return doc || null;
  },

  async getPublicKey(targetUserId) {
    check(targetUserId, String);
    const user = await Meteor.users.findOneAsync(targetUserId, {
      fields: { publicKey: 1 },
    });
    return user?.publicKey || null;
  },

  async users_blockUser(targetUserId) {
    check(targetUserId, String);
    const user = await Meteor.userAsync();
    if (!user) throw new Meteor.Error('not-authorized');
    if (targetUserId === user._id)
      throw new Meteor.Error('invalid', 'Cannot block yourself.');
    await Meteor.users.updateAsync(user._id, {
      $addToSet: { blockedUserIds: targetUserId },
    });
  },

  async users_unblockUser(targetUserId) {
    check(targetUserId, String);
    const user = await Meteor.userAsync();
    if (!user) throw new Meteor.Error('not-authorized');
    await Meteor.users.updateAsync(user._id, {
      $pull: { blockedUserIds: targetUserId },
    });
  },

  async users_searchForMessages(query) {
    check(query, String);
    const caller = await Meteor.userAsync();
    if (!caller) throw new Meteor.Error('not-authorized');

    const host = getHost(this);
    const platform = await Platform.findOneAsync();
    const isFederation = Boolean(platform?.isFederationLayout);
    const q = query.trim().toLowerCase();

    let candidateIds;
    if (!isFederation) {
      const membershipsAtHost = await Memberships.find(
        { host },
        { fields: { userId: 1 } }
      ).fetchAsync();
      candidateIds = membershipsAtHost
        .map((m) => m.userId)
        .filter((id) => id !== caller._id);
    }

    const filter = isFederation
      ? { _id: { $ne: caller._id } }
      : { _id: { $in: candidateIds } };

    const users = await Meteor.users
      .find(filter, {
        fields: {
          _id: 1,
          username: 1,
          avatar: 1,
          firstName: 1,
          lastName: 1,
        },
      })
      .fetchAsync();

    const filtered = users.filter((u) => {
      const full = `${u.firstName ?? ''} ${u.lastName ?? ''} ${
        u.username ?? ''
      }`.toLowerCase();
      return full.includes(q);
    });

    const filteredIds = filtered.map((u) => u._id);
    const filteredMemberships = await Memberships.find(
      { userId: { $in: filteredIds } },
      { fields: { userId: 1, host: 1 } }
    ).fetchAsync();
    const hostsByUserId = {};
    filteredMemberships.forEach((m) => {
      if (!hostsByUserId[m.userId]) {
        hostsByUserId[m.userId] = [];
      }
      hostsByUserId[m.userId].push(m.host);
    });

    const matched = filtered.map((u) => ({
      _id: u._id,
      username: u.username,
      avatar: u.avatar,
      firstName: u.firstName,
      lastName: u.lastName,
      memberHosts: hostsByUserId[u._id] ?? [],
    }));

    if (!isFederation) {
      return matched.slice(0, 8);
    }

    // Federation: same-host members first, then other communities
    const sameHost = matched.filter((u) => u.memberHosts.includes(host));
    const otherHosts = matched.filter((u) => !u.memberHosts.includes(host));
    return [...sameHost, ...otherHosts].slice(0, 12);
  },
});
