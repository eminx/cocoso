Meteor.methods({
	createGathering(formValues, imageUrl) {
		check(formValues.title, String);
		check(formValues.shortDescription, String);
		check(formValues.longDescription, String);
		check(formValues.room, String);
		check(formValues.capacity, Number);
		check(formValues.duration, Number);
		check(formValues.phoneNumber, String);
		check(formValues.datePicker, String);
		check(formValues.timePickerStart, String);
		check(formValues.timePickerEnd, String);
		check(formValues.isRSVPrequired, Boolean);
		check(imageUrl, String);
		
		const userId = Meteor.userId();
		try {
			const add = Gatherings.insert({
				authorId: userId,
				authorName: 'someone',
				title: formValues.title,
				shortDescription: formValues.shortDescription,
				longDescription: formValues.longDescription,
				room: formValues.room,
				capacity: formValues.capacity,
				phoneNumber: formValues.phoneNumber,
				isRSVPrequired: formValues.isRSVPrequired,
				startDate: formValues.datePicker,
				endDate: formValues.datePicker,
				startTime: formValues.timePickerStart,
				endTime: formValues.timePickerEnd,
				duration: formValues.duration,
				imageUrl: imageUrl,
				isSentForReview: true,
				isPublished: false
			});
			return add;
		} catch(e) {
			throw new Meteor.Error(e, "Couldn't add to Collection");
		}
	}
});

Meteor.publish('gatherings', function () {
  return Gatherings.find({}, {
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
