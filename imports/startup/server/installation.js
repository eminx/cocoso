import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import Hosts from '/imports/api/hosts/host';
import Pages from '/imports/api/pages/page';
import { defaultMainColor, defaultMenu, defaultEmails } from '../constants';

const username = 'ilkergonenc';
const email = 'ilkergonenc@gmail.com';
const password = 'password';
const hostname = 'localhost:3000';

async function freshInstallment() {
  const superAdminFixture = {
    username,
    email,
    password,
    isSuperAdmin: true,
  };
  const superAdmin = await setGetSuperAdmin(superAdminFixture);

  const superHostFixture = {
    host: hostname,
    email,
    settings: {
      name: 'Local Affairs',
      email: 'ilkergonenc@gmail.com',
      address: 'Paper str. 678',
      city: 'Agonda Bay',
      country: 'Sri Lanka',
      mainColor: defaultMainColor,
      menu: defaultMenu,
    },
    members: [],
    emails: defaultEmails,
    createdAt: new Date(),
  };
  const superHost = await setGetSuperHost(superHostFixture);

  setMembership(superAdmin, superHost);

  const aboutPageFixture = {
    host: superHost.host,
    authorId: superAdmin._id,
    authorName: superAdmin.username,
    title: `About ${superHost.settings.name}`,
  };
  setAboutPageForHost(aboutPageFixture);

  // console.log(superAdmin);
  // console.log(superHost);
}

async function setGetSuperAdmin(superAdmin) {
  if (Accounts.findUserByUsername(username)) {
    return Meteor.users.findOne({ username });
  }
  const userId = await Accounts.createUser(superAdmin);
  return Meteor.users.findOne({ _id: userId });
}

async function setGetSuperHost(superHost) {
  if (Hosts.findOne({ host: hostname })) {
    return Hosts.findOne({ host: hostname });
  }
  const hostId = await Hosts.insert(superHost);
  return Hosts.findOne({ _id: hostId });
}

function setMembership(user, host) {
  if (!user.memberships[0]) {
    Meteor.users.update(user._id, {
      $addToSet: {
        memberships: {
          host: host.host,
          role: 'admin',
          date: new Date(),
        },
      },
    });
  }
  if (!host.members[0]) {
    Hosts.update(host._id, {
      $addToSet: {
        members: {
          id: user._id,
          username: user.username,
          email,
          role: 'admin',
          date: new Date(),
        },
      },
    });
  }
}

function setAboutPageForHost({ host, authorId, authorName, title }) {
  if (!Pages.findOne({ host })) {
    Pages.insert({
      host,
      authorId,
      authorName,
      title,
      longDescription: title,
      isPublished: true,
      creationDate: new Date(),
    });
  }
}

export { freshInstallment };
