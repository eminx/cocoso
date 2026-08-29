import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getHost } from '../_utils/shared';
import Hosts from './host';
import Pages from '../pages/page';
import {
  defaultEmails,
  defaultMenu,
  defaultTheme,
} from '../../startup/constants';
import { isAdmin } from '../users/user.roles';
import Memberships from '../memberships/membership';
import { attachMembershipsToUsers } from '../memberships/membership.helpers';

function getUsersRandomlyWithAvatarsFirst(users) {
  if (!users || !users.length === 0) {
    return null;
  }
  const usersWithImage = users.filter((u) => u.avatar && u.avatar.src);
  const usersWithoutImage = users.filter((u) => !u.avatar || !u.avatar.src);

  return [
    ...usersWithImage.sort(() => Math.random() - 0.5),
    ...usersWithoutImage.sort(() => Math.random() - 0.5),
  ];
}

const publicUserFields = {
  _id: 1,
  avatar: 1,
  bio: 1,
  contactInfo: 1,
  firstName: 1,
  isPublic: 1,
  keywords: 1,
  lastName: 1,
  username: 1,
};

Meteor.methods({
  async createNewHost(values) {
    const currentUser = await Meteor.userAsync();
    if (!currentUser || !currentUser.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    if (await Hosts.findOneAsync({ host: values.host })) {
      throw new Meteor.Error('A hub with this url already exists');
    }

    try {
      await Hosts.insertAsync({
        emails: defaultEmails,
        host: values.host,
        settings: {
          name: values.name,
          email: values.email,
          address: values.address,
          city: values.city,
          country: values.country,
          menu: defaultMenu,
          lang: 'en',
          hue: Math.ceil(Math.random() * 360).toString(),
        },
        theme: defaultTheme,
        createdAt: new Date(),
      });

      await Pages.insertAsync({
        host: values.host,
        authorId: currentUser._id,
        authorName: currentUser.username,
        title: `About ${values.name}`,
        longDescription: values.about,
        isPublished: true,
        order: 1,
        creationDate: new Date(),
      });

      await Memberships.insertAsync({
        userId: currentUser._id,
        host: values.host,
        role: 'admin',
        date: new Date(),
        isPublic: true,
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async getPortalHost() {
    try {
      const portalHost = await Hosts.findOneAsync({ isPortalHost: true });
      return portalHost;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async getCurrentHost() {
    const host = getHost(this);
    try {
      const currentHost = await Hosts.findOneAsync(
        { host },
        {
          fields: {
            host: 1,
            isPortalHost: 1,
            logo: 1,
            settings: 1,
            theme: 1,
          },
        }
      );
      return currentHost;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async getHost(host) {
    return await Hosts.findOneAsync(
      { host },
      {
        fields: {
          host: 1,
          isPortalHost: 1,
          logo: 1,
          settings: 1,
          theme: 1,
        },
      }
    );
  },

  async getAllHosts() {
    try {
      const hosts = await Hosts.find().fetchAsync();

      const counts = await Memberships.rawCollection()
        .aggregate([{ $group: { _id: '$host', count: { $sum: 1 } } }])
        .toArray();
      const membersCountByHost = {};
      counts.forEach((c) => {
        membersCountByHost[c._id] = c.count;
      });

      return (
        hosts
          // .filter((h) => !h.isPortalHost)
          .map((host) => ({
            name: host.settings.name,
            logo: host.logo,
            host: host.host,
            city: host.settings.city,
            country: host.settings.country,
            createdAt: host.createdAt,
            membersCount: membersCountByHost[host.host] || 0,
          }))
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async getHostMembersForAdmin() {
    const host = getHost(this);
    const currentUser = await Meteor.userAsync();

    if (!currentUser || !(await isAdmin(currentUser._id, host))) {
      throw new Meteor.Error('You are not allowed!');
    }

    const memberships = await Memberships.find({ host }).fetchAsync();
    const userIds = memberships.map((m) => m.userId);
    const users = await Meteor.users
      .find(
        { _id: { $in: userIds } },
        { fields: { username: 1, emails: 1, avatar: 1 } }
      )
      .fetchAsync();
    const userById = Object.fromEntries(users.map((u) => [u._id, u]));

    return memberships.map((m) => {
      const user = userById[m.userId];
      return {
        id: m.userId,
        username: user?.username,
        email: user?.emails?.[0]?.address,
        avatar: user?.avatar?.src,
        role: m.role,
        date: m.date,
        isPublic: m.isPublic,
      };
    });
  },

  async getHostMembers(hostPredefined) {
    const host = hostPredefined || getHost(this);

    const memberships = await Memberships.find(
      { host, isPublic: true },
      { fields: { userId: 1 } }
    ).fetchAsync();
    const userIds = memberships.map((m) => m.userId);

    const users = await Meteor.users
      .find(
        { _id: { $in: userIds } },
        {
          fields: publicUserFields,
        }
      )
      .fetchAsync();

    const usersWithMemberships = await attachMembershipsToUsers(users);

    return getUsersRandomlyWithAvatarsFirst(usersWithMemberships);
  },

  async getAllMembersFromAllHosts() {
    const users = await Meteor.users
      .find(
        {},
        {
          fields: publicUserFields,
        }
      )
      .fetchAsync();

    const usersWithMemberships = await attachMembershipsToUsers(users);

    return getUsersRandomlyWithAvatarsFirst(usersWithMemberships);
  },

  async getHostInfoPage(host) {
    const infoPages = await Pages.find(
      {
        host,
      },
      {
        fields: {
          longDescription: 1,
        },
        sort: { creationDate: 1 },
      }
    ).fetchAsync();

    return infoPages && infoPages[0] && infoPages[0].longDescription;
  },

  async getPortalHostInfoPage() {
    const portalHost = await Hosts.findOneAsync({ isPortalHost: true });
    if (!portalHost) {
      throw new Meteor.Error('no portalhost defined');
    }

    return await Pages.findOneAsync(
      {
        host: portalHost.host,
      },
      {
        images: 1,
        longDescription: 1,
        title: 1,
      }
    );
  },

  async setHostHue(hue) {
    check(hue, String);
    const host = getHost(this);
    const currentHost = Hosts.findOneAsync({ host });
    const currentUser = await Meteor.userAsync();

    if (!currentUser || !(await isAdmin(currentUser._id, host))) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      await Hosts.updateAsync(currentHost._id, {
        $set: {
          'settings.hue': hue,
        },
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async updateHostTheme(theme) {
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const currentUser = await Meteor.userAsync();

    if (!currentUser || !(await isAdmin(currentUser._id, host))) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      await Hosts.updateAsync(currentHost._id, {
        $set: {
          theme,
        },
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
