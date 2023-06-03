import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';
import Hosts from './host';
import Pages from '../pages/page';
import { defaultMenu, defaultEmails } from '../../startup/constants';

Meteor.methods({
  createNewHost(values) {
    const currentUser = Meteor.user();
    if (!currentUser || !currentUser.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    if (Hosts.findOne({ host: values.host })) {
      throw new Meteor.Error('A hub with this url already exists');
    }

    try {
      Hosts.insert({
        host: values.host,
        settings: {
          name: values.name,
          email: values.email,
          address: values.address,
          city: values.city,
          country: values.country,
          menu: defaultMenu,
        },
        members: [
          {
            avatar: currentUser.avatar.src,
            date: new Date(),
            email: currentUser.emails[0].address,
            id: currentUser._id,
            role: 'admin',
            username: currentUser.username,
            isPublic: false,
          },
        ],
        emails: defaultEmails,
        createdAt: new Date(),
      });

      Pages.insert({
        host: values.host,
        authorId: currentUser._id,
        authorName: currentUser.username,
        title: `About ${values.name}`,
        longDescription: values.about,
        isPublished: true,
        creationDate: new Date(),
      });

      Meteor.users.update(currentUser._id, {
        $push: {
          memberships: {
            host: values.host,
            role: 'admin',
            date: new Date(),
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  getCurrentHost() {
    const host = getHost(this);
    try {
      const currentHost = Hosts.findOne({ host });
      return currentHost;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getAllHosts() {
    try {
      const hosts = Hosts.find().fetch();
      return hosts.map((host, index) => ({
        name: host.settings.name,
        logo: host.logo,
        host: host.host,
        city: host.settings.city,
        country: host.settings.country,
        createdAt: host.createdAt,
        membersCount: host.members.length,
      }));
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getHostMembers() {
    const host = getHost(this);
    const hostUsers = Meteor.users.find({ 'memberships.host': host }).fetch();

    const hostUsersPublic = hostUsers.filter((member) => {
      return Boolean(member.memberships?.find((membership) => membership.host === host)?.isPublic);
    });

    console.log(hostUsersPublic);

    return hostUsersPublic.map((user) => ({
      avatar: user.avatar?.src,
      bio: user.bio,
      firstName: user.firstName,
      id: user._id,
      isPublic: true,
      lastName: user.lastName,
      memberships: user.memberships,
      username: user.username,
    }));
  },

  getAllMembersFromAllHosts() {
    const allUsers = Meteor.users.find().fetch();
    return allUsers
      .map((user) => ({
        avatar: user.avatar?.src,
        bio: user.bio,
        date: user.date,
        firstName: user.firstName,
        id: user._id,
        isPublic: user.isPublic,
        lastName: user.lastName,
        memberships: user.memberships,
        username: user.username,
      }))
      .reverse();
  },
});
