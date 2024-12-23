import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getHost } from '../_utils/shared';
import Hosts from './host';
import Pages from '../pages/page';
import Newsletters from '../newsletters/newsletter';
import { defaultMenu, defaultEmails } from '../../startup/constants';
import { isAdmin } from '../users/user.roles';

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
          lang: 'en',
          hue: Math.ceil(Math.random() * 360).toString(),
        },
        members: [
          {
            avatar: currentUser.avatar?.src,
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
            date: new Date(),
            host: values.host,
            hostname: values.name,
            isPublic: true,
            role: 'admin',
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  getPortalHost() {
    try {
      const portalHost = Hosts.findOne({ isPortalHost: true });
      return portalHost;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getCurrentHost() {
    const host = getHost(this);
    try {
      const currentHost = Hosts.findOne(
        { host },
        {
          fields: {
            host: 1,
            settings: 1,
            logo: 1,
            isPortalHost: 1,
          },
        }
      );
      return currentHost;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getHost(host) {
    return Hosts.findOne(
      { host },
      {
        fields: {
          host: 1,
          settings: 1,
          logo: 1,
          isPortalHost: 1,
        },
      }
    );
  },

  getAllHosts() {
    try {
      const hosts = Hosts.find().fetch();
      return (
        hosts
          // .filter((h) => !h.isPortalHost)
          .map((host, index) => ({
            name: host.settings.name,
            logo: host.logo,
            host: host.host,
            city: host.settings.city,
            country: host.settings.country,
            createdAt: host.createdAt,
            membersCount: host.members.length,
          }))
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getHostMembersForAdmin() {
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const currentUser = Meteor.user();

    if (!currentUser || !isAdmin(currentUser, currentHost)) {
      throw new Meteor.Error('You are not allowed!');
    }

    return currentHost.members;
  },

  getHostMembers(host) {
    if (!host) {
      host = getHost(this);
    }

    const users = Meteor.users
      .find(
        { 'memberships.host': host },
        {
          fields: {
            avatar: 1,
            bio: 1,
            firstName: 1,
            id: 1,
            isPublic: true,
            keywords: 1,
            lastName: 1,
            memberships: 1,
            username: 1,
          },
        }
      )
      .fetch();

    return users
      .filter((user) => user.memberships.find((m) => m.host === host)?.isPublic)
      .reverse();
  },

  getAllMembersFromAllHosts() {
    return Meteor.users
      .find(
        {},
        {
          fields: {
            avatar: 1,
            bio: 1,
            contactInfo: 1,
            date: 1,
            firstName: 1,
            id: 1,
            isPublic: 1,
            keywords: 1,
            lastName: 1,
            memberships: 1,
            username: 1,
          },
        }
      )
      .fetch()
      .reverse();
  },

  getHostInfoPage(host) {
    const infoPages = Pages.find(
      {
        host,
      },
      {
        longDescription: 1,
      },
      {
        $sort: { creationDate: 1 },
      }
    ).fetch();

    return infoPages && infoPages[0] && infoPages[0].longDescription;
  },

  getPortalHostInfoPage() {
    const portalHost = Hosts.findOne({ isPortalHost: true });
    if (!portalHost) {
      return;
    }
    const infoPage = Pages.findOne(
      {
        host: portalHost.host,
      },
      {
        longDescription: 1,
      }
    );

    return infoPage;
  },

  setHostHue(hue) {
    check(hue, String);
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const currentUser = Meteor.user();

    if (!currentUser || !isAdmin(currentUser, currentHost)) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Hosts.update(currentHost._id, {
        $set: {
          'settings.hue': hue,
        },
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getNewslettersForHost() {
    const host = getHost(this);

    return Newsletters.find({ host }).fetch();
  },

  sendNewsletter(email, emailHtml) {
    check(emailHtml, String);
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const currentUser = Meteor.user();

    if (!currentUser || !isAdmin(currentUser, currentHost)) {
      throw new Meteor.Error('You are not allowed!');
    }

    const newEmailId = Newsletters.insert({
      ...email,
      authorId: currentUser._id,
      authorUsername: currentUser.username,
      creationDate: new Date(),
      host,
      hostId: currentHost._id.toString(),
    });

    const emailHtmlWithBrowserLink = emailHtml.replace('[newsletter-id]', newEmailId);

    const isPortalHost = currentHost.isPortalHost;
    const members = isPortalHost ? Meteor.users.find() : currentHost.members;

    try {
      members.forEach((member) => {
        const emailHtmlWithUsername = emailHtmlWithBrowserLink.replace(
          '[username]',
          member.username
        );

        const emailAddress = isPortalHost ? member.emails[0].address : member.email;

        Meteor.call(
          'sendEmail',
          emailAddress,
          email.subject,
          emailHtmlWithUsername,
          (error, respond) => {
            if (error) {
              console.log(error);
            }
          }
        );
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getHostValue() {
    const host = getHost(this);
    return host;
  },
});
