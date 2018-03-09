Meteor.publish('attendingEvents', function() {
	return Meteor.users.find(this.userId, {
		fields: {
			attending: 1
		}
	})
});

Meteor.publish('gatherings', function () {
  return Gatherings.find({
  	// isPublished: true
  }, {
    fields: {
    	isSentForReview: 0,
    	phoneNumber: 0
    }
  });
});

Meteor.publish('gathering', function (id) {
  return Gatherings.find(id)
  /*, {
    fields: {
    	isSentForReview: 0,
    	phoneNumber: 0
    }
  })*/;
});