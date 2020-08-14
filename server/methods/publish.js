import { Meteor } from 'meteor/meteor';
import { getHost } from './shared';

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
  const user = Meteor.user();
  if (user && user.isSuperAdmin) {
    return Activities.find();
  } else if (user) {
    return Activities.find(
      {
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
  return Documents.find({
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
  const user = Meteor.user();
  if (user && user.isSuperAdmin) {
    return Activities.find({
      _id: id,
    });
  } else if (user) {
    return Activities.find({
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
  return Processes.find({
    _id: id,
  });
});

Meteor.publish('publication', function (id) {
  return Publications.find({
    _id: id,
  });
});

Meteor.publish('pages', function () {
  return Pages.find();
});

Meteor.publish('page', function (title) {
  return Pages.find({ title });
});

Meteor.publish('work', function (id) {
  return Works.find({
    _id: id,
  });
});

Meteor.publish('myworks', function () {
  const currentUserId = Meteor.userId();
  return Works.find({
    authorId: currentUserId,
  });
});

Meteor.publish('chat', function (contextId) {
  const user = Meteor.user();
  if (user) {
    return Chats.find({
      contextId: contextId,
    });
  }
});

Meteor.publish('resources', function () {
  return Resources.find();
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
  return Hosts.find({ host }, { fields: { settings: true } });
});
