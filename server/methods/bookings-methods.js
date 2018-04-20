Meteor.methods({
	createBooking(formValues) {
		check(formValues.title, String);
		check(formValues.room, String);
		check(formValues.duration, Number);
		check(formValues.datePicker, String);
		check(formValues.timePickerStart, String);
		check(formValues.timePickerEnd, String);
		
		const user = Meteor.user();
		try {
			const add = Gatherings.insert({
				authorId: user._id,
				authorName: user.username,
				title: formValues.title,
				longDescription: formValues.longDescription,
				room: formValues.room,
				startDate: formValues.datePicker,
				endDate: formValues.datePicker,
				startTime: formValues.timePickerStart,
				endTime: formValues.timePickerEnd,
				duration: formValues.duration,
				isSentForReview: true,
				isPublished: true,
				creationDate: new Date()
			});
			return add;
		} catch(e) {
			throw new Meteor.Error(e, "Couldn't add to Collection");
		}
	},
})