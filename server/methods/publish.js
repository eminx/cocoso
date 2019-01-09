Meteor.publish('attendingEvents', function() {
  return Meteor.users.find(this.userId, {
    fields: {
      attending: 1,
      profile: 1,
      isSuperAdmin: 1
    }
  });
});

Meteor.publish('gatherings', function() {
  const user = Meteor.user();
  if (user && user.isSuperAdmin) {
    return Gatherings.find();
  } else if (user) {
    return Gatherings.find(
      {
        $or: [
          {
            isPublished: true
          },
          {
            authorId: user._id
          }
        ]
      },
      {
        fields: {
          isSentForReview: 0,
          phoneNumber: 0
        }
      }
    );
  } else {
    return Gatherings.find({
      isPublished: true
    });
  }
});

Meteor.publish('groups', function() {
  // const user = Meteor.user();
  // if (user) {
  return Groups.find({
    isPublished: true
  });
  // }
});

Meteor.publish('publications', function() {
  return Publications.find({
    isPublished: true
  });
  // }
});

Meteor.publish('gathering', function(id) {
  const user = Meteor.user();
  if (user && user.isSuperAdmin) {
    return Gatherings.find({
      _id: id
    });
  } else if (user) {
    return Gatherings.find({
      _id: id,
      $or: [
        {
          isPublished: true
        },
        {
          authorId: user._id
        }
      ]
    });
  } else {
    return Gatherings.find({
      _id: id,
      isPublished: true
    });
  }
  /*, {
    fields: {
    	isSentForReview: 0,
    	phoneNumber: 0
    }
  })*/
});

Meteor.publish('group', function(id) {
  return Groups.find({
    _id: id
  });
});

Meteor.publish('publication', function(id) {
  return Publications.find({
    _id: id
  });
});

Meteor.publish('pages', function() {
  return Pages.find();
});

Meteor.publish('chat', function(contextId) {
  const user = Meteor.user();
  if (user) {
    return Chats.find({
      contextId: contextId
    });
  }
});

Meteor.publish('places', function() {
  return Places.find();
});

Meteor.publish('documents', function() {
  return Documents.find();
});

Meteor.publish('users', function() {
  const user = Meteor.user();
  if (user && user.isSuperAdmin) {
    return Meteor.users.find();
  }
});

Meteor.publish('me', function() {
  const userId = Meteor.userId();
  if (userId) {
    return Meteor.users.find(userId);
  }
});
