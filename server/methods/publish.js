import { Meteor } from 'meteor/meteor';
import { getHost, isContributorOrAdmin } from './shared';

Meteor.publishLite('attendingEvents', function () {
  return Meteor.users.find(this.userId, {
    fields: {
      attending: 1,
      profile: 1,
      isSuperAdmin: 1,
    },
  });
});

Meteor.publishLite('activities', function (onlyPublic = false) {
  const host = getHost(this);
  const fields = {
    title: 1,
    datesAndTimes: 1,
    roomIndex: 1,
    room: 1,
    place: 1,
    isPublicActivity: 1,
    authorName: 1,
  };
  const publicFields = {
    title: 1,
    subTitle: 1,
    imageUrl: 1,
    datesAndTimes: 1,
    isPublicActivity: 1,
  };

  // Activities._ensureIndex({ host, isPublished: true });

  if (onlyPublic) {
    return Activities.find(
      {
        host,
        isPublished: true,
        isPublicActivity: true,
      },
      { fields: publicFields }
    );
  } else {
    return Activities.find({ host, isPublished: true }, { fields });
  }
});

Meteor.publishLite('processes', function () {
  const userId = Meteor.userId();
  const host = getHost(this);
  // Processes._ensureIndex({ host, isPublished: true });

  const fields = {
    title: 1,
    readingMaterial: 1,
    imageUrl: 1,
    meetings: 1,
    adminUsername: 1,
    adminId: 1,
  };
  if (userId) {
    (fields.members = 1), (fields.peopleInvited = 1);
  }

  return Processes.find(
    {
      host,
      isPublished: true,
    },
    {
      fields,
      sort: { creationDate: 1 },
    }
  );
});

Meteor.publishLite('activity', function (id) {
  const host = getHost(this);
  return Activities.find({
    host,
    _id: id,
  });
});

Meteor.publishLite('process', function (id) {
  const host = getHost(this);
  return Processes.find({
    host,
    _id: id,
  });
});

Meteor.publishLite('pages', function () {
  const host = getHost(this);
  return Pages.find({ host });
});

Meteor.publishLite('page', function (title) {
  const host = getHost(this);
  return Pages.find({ host, title });
});

Meteor.publishLite('work', function (id) {
  return Works.find({
    _id: id,
  });
});

Meteor.publishLite('myworks', function () {
  const currentUserId = Meteor.userId();
  const host = getHost(this);
  // Works._ensureIndex({ host, authorId: currentUserId });
  return Works.find({
    host,
    authorId: currentUserId,
  });
});

Meteor.publishLite('chat', function (contextId) {
  const host = getHost(this);
  const user = Meteor.user();
  if (user) {
    return Chats.find({
      contextId: contextId,
    });
  }
});

Meteor.publishLite('resources', function () {
  const host = getHost(this);
  // Resources._ensureIndex({ host });
  return Resources.find({ host });
});

Meteor.publishLite('documents', function () {
  return Documents.find();
});

Meteor.publishLite('me', function () {
  const userId = Meteor.userId();
  if (userId) {
    return Meteor.users.find(userId);
  }
});

Meteor.publishLite('currentHost', function () {
  const host = getHost(this);
  return Hosts.find({ host }, { fields: { settings: true, logo: true } });
});

Meteor.publishLite('members', function () {
  const user = Meteor.user();
  const host = getHost(this);
  const currentHost = Hosts.findOne({ host });

  if (user.isSuperAdmin || isContributorOrAdmin(user, currentHost)) {
    return Hosts.find({ host });
  }
});

Meteor.publishLite('membersForPublic', function () {
  const host = getHost(this);
  // Meteor.users._ensureIndex({ 'memberships.host': host });
  return Meteor.users.find(
    { 'memberships.host': host },
    {
      fields: {
        _id: true,
        username: true,
        avatar: true,
        firstName: true,
        lastName: true,
      },
    }
  );
});

Meteor.publishLite('memberAtHost', function (username) {
  const host = getHost(this);
  return Meteor.users.find({
    username,
    'memberships.host': host,
  });
});

Meteor.publishLite('memberWorksAtHost', function (username) {
  const host = getHost(this);
  return Works.find({
    authorUsername: username,
    host,
  });
});
