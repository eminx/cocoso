Meteor.publish('attendingEvents', function() {
	return Meteor.users.find(this.userId, {
		fields: {
			attending: 1,
      profile: 1,
      isSuperAdmin: 1
		}
	})
});

Meteor.publish('gatherings', function () {
  const user = Meteor.user();
  if (user.isSuperAdmin) {
    return Gatherings.find();
  } else {
    return Gatherings.find({
    	$or: [{
        isPublished: true
      }, {
        authorId: user._id
      }]
    }, {
      fields: {
      	isSentForReview: 0,
      	phoneNumber: 0
      }
    });
  }
});

Meteor.publish('gathering', function (id) {
  const user = Meteor.user();
  if (user.isSuperAdmin) {
    return Gatherings.find({
      $or: [{
        isPublished: true
      }, {
        authorId: user._id
      }]
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
  })*/;
});

Accounts.onCreateUser(function (options, user) {
  user.attending = [];
  return user;
});