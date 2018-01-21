Meteor.methods({
	createGathering(userId, formValues) {
		console.log('received:', userId, formValues);
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
		
		const currentUserId = Meteor.userId();
		if (currentUserId === userId) {
			try {
				const add = Gatherings.insert({
					authorId: userId,
					authorName: 'someonE',
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
					isSentForReview: false,
					isPublished: false
				});
			} catch(e) {
				throw new Meteor.Error('phishy-spam', "Couldn't add to Collection");
			}
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
