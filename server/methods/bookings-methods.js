const placesList = Places.find().fetch();
console.log("placesList", placesList);

const getRoomIndex = (room) => {
  if (placesList.length > 0) {
  	let roomIndex;
    placesList.forEach((place, i) => {
      if (place.name === room) {
      	console.log("i.toString()", i.toString());
        roomIndex = i.toString();
      }
    })
    return roomIndex;
  }
};

Meteor.methods({
	createBooking(formValues) {
		check(formValues.title, String);
		check(formValues.room, String);
		check(formValues.duration, Number);
		check(formValues.datePicker, String);
		check(formValues.timePickerStart, String);
		check(formValues.timePickerEnd, String);
		
		const roomIndex = getRoomIndex(formValues.room);
		const user = Meteor.user();
		
		try {
			const add = Gatherings.insert({
				authorId: user._id,
				authorName: user.username,
				title: formValues.title,
				longDescription: formValues.longDescription,
				room: formValues.room,
				roomIndex: roomIndex,
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

	updateBooking(formValues, bookingId) {
		check(formValues.title, String);
		check(formValues.room, String);
		check(formValues.duration, Number);
		check(formValues.datePicker, String);
		check(formValues.timePickerStart, String);
		check(formValues.timePickerEnd, String);

		const roomIndex = getRoomIndex(formValues.room);
		console.log("roomIndex", roomIndex);
		const user = Meteor.user();
		const theG = Gatherings.findOne(bookingId);
		if (user._id !== theG.authorId) {
			throw new Meteor.Error("You are not allowed!");
			return false;
		};
		
		try {
			const add = Gatherings.update(bookingId, {
				$set: {
					title: formValues.title,
					longDescription: formValues.longDescription,
					room: formValues.room,
					roomIndex: roomIndex,
					startDate: formValues.datePicker,
					endDate: formValues.datePicker,
					startTime: formValues.timePickerStart,
					endTime: formValues.timePickerEnd,
					duration: formValues.duration,
					latestUpdate: new Date()
				}
			});
			return bookingId;
		} catch(e) {
			throw new Meteor.Error(e, "Couldn't add to Collection");
		}
	}
})