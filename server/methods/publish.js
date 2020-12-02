import { Meteor } from 'meteor/meteor';
import { getHost, isContributorOrAdmin } from './shared';

Meteor.publish('attendingEvents', function () {
  return Meteor.users.find(this.userId, {
    fields: {
      attending: 1,
      profile: 1,
      isSuperAdmin: 1,
    },
  });
});

Meteor.publish('activities', function () {
  const host = getHost(this);
  const user = Meteor.user();
  if (user && user.isSuperAdmin) {
    return Activities.find({ host });
  } else if (user) {
    return Activities.find(
      {
        host,
        $or: [
          {
            isPublished: true,
          },
          {
            authorId: user._id,
          },
        ],
      },
      {
        fields: {
          isSentForReview: 0,
          phoneNumber: 0,
        },
      }
    );
  } else {
    return Activities.find({
      host,
      isPublished: true,
    });
  }
});

Meteor.publish('processes', function () {
  const host = getHost(this);
  return Processes.find({
    host,
    isPublished: true,
  });
});

Meteor.publish('manuals', function () {
  const host = getHost(this);
  return Documents.find({
    host,
    contextType: 'manual',
  });
});

Meteor.publish('publications', function () {
  return Publications.find({
    isPublished: true,
  });
  // }
});

Meteor.publish('gathering', function (id) {
  const host = getHost(this);
  const user = Meteor.user();
  if (user && user.isSuperAdmin) {
    return Activities.find({
      host,
      _id: id,
    });
  } else if (user) {
    return Activities.find({
      host,
      _id: id,
      $or: [
        {
          isPublished: true,
        },
        {
          authorId: user._id,
        },
      ],
    });
  } else {
    return Activities.find({
      _id: id,
      isPublished: true,
    });
  }
  /*, {
    fields: {
    	isSentForReview: 0,
    	phoneNumber: 0
    }
  })*/
});

Meteor.publish('process', function (id) {
  const host = getHost(this);
  return Processes.find({
    host,
    _id: id,
  });
});

Meteor.publish('pages', function () {
  const host = getHost(this);
  return Pages.find({ host });
});

Meteor.publish('page', function (title) {
  const host = getHost(this);
  return Pages.find({ host, title });
});

Meteor.publish('work', function (id) {
  return Works.find({
    _id: id,
  });
});

Meteor.publish('myworks', function () {
  const currentUserId = Meteor.userId();
  const host = getHost(this);
  return Works.find({
    host,
    authorId: currentUserId,
  });
});

Meteor.publish('chat', function (contextId) {
  const host = getHost(this);
  const user = Meteor.user();
  if (user) {
    return Chats.find({
      contextId: contextId,
    });
  }
});

Meteor.publish('resources', function () {
  const host = getHost(this);
  return Resources.find({ host });
});

Meteor.publish('documents', function () {
  return Documents.find();
});

Meteor.publish('users', function () {
  const user = Meteor.user();
  if (user && user.isSuperAdmin) {
    return Meteor.users.find();
  }
});

Meteor.publish('me', function () {
  const userId = Meteor.userId();
  if (userId) {
    return Meteor.users.find(userId);
  }
});

Meteor.publish('currentHost', function () {
  const host = getHost(this);
  return Hosts.find({ host }, { fields: { settings: true, logo: true } });
});

Meteor.publish('members', function () {
  const user = Meteor.user();
  const host = getHost(this);
  const currentHost = Hosts.findOne({ host });

  if (user.isSuperAdmin || isContributorOrAdmin(user, currentHost)) {
    return Hosts.find({ host });
  }
});

Meteor.publish('membersForPublic', function () {
  const host = getHost(this);

  return Meteor.users.find(
    { 'memberships.host': host },
    {
      fields: {
        _id: true,
        username: true,
        avatar: true,
      },
    }
  );
});

Meteor.publish('memberAtHost', function (username) {
  const host = getHost(this);
  return Meteor.users.find({
    username,
    'memberships.host': host,
  });
});

Meteor.publish('memberWorksAtHost', function (username) {
  const host = getHost(this);
  return Works.find({
    authorUsername: username,
    host,
  });
});
