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
	},

	registerAttendance(gatheringId) {
		if (!Meteor.userId()) {
			return null;
		} else {
			check(gatheringId, String);
			const currentUser = Meteor.user();
			const theGathering = Gatherings.findOne(gatheringId);
			if (theGathering.capacity > theGathering.attendees.length) {
				try {
					Gatherings.update(gatheringId, {
						$addToSet: {
	            attendees: {
	              userId: currentUser._id, 
	              userInfo: currentUser.profile, 
	              date: new Date()
	            }
	          }
					});
					try {
						Meteor.users.update(currentUser._id, {
							$addToSet: {
								attending: {
									gatheringId: theGathering._id,
									gatheringTitle: theGathering.title,
									gatheringAuthorName: theGathering.authorName,
									gatheringAuthorId: theGathering.authorId
								}
							}
						});
					} catch(err) {
						throw new Meteor.Error(e, "Couldn't update the Collection");
					}
					return true;
				} catch(err) {
					console.log(err);
					throw new Meteor.Error(err, "Couldn't update the Collection");
				}
			} else {
				console.log(err);
				throw new Meteor.Error(err, "Sorry the capacity is full");
			}
		}
	},

	unRegisterAttendance(gatheringId) {
		if (!Meteor.userId()) {
			return null;
		} else {
			check(gatheringId, String);
			const currentUser = Meteor.user();
			const theGathering = Gatherings.findOne(gatheringId);
			try {
				Gatherings.update(gatheringId, {
					$pull: {
            attendees: {
              userId: Meteor.userId()
            }
          }
				});
				try {
					Meteor.users.update(currentUser._id, {
						$pull: {
							attending: {
								gatheringId: theGathering._id
							}
						}
					});
				} catch(err) {
					console.log(err);
					throw new Meteor.Error(err, "Couldn't update the Collection");
				}
				return true;
			} catch(err) {
				console.log(err);
				throw new Meteor.Error(err, "Couldn't update the Collection");
			}
		}
	}
});

