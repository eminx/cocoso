const getRoomIndex = room => {
  const placesList = Places.find().fetch();
  if (placesList.length > 0) {
    let roomIndex;
    placesList.forEach((place, i) => {
      if (place.name === room) {
        roomIndex = i.toString();
      }
    });
    return roomIndex;
  }
};

Meteor.methods({
  createBooking(formValues, uploadedImage) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }

    if (formValues.isPublicActivity && !uploadedImage) {
      throw new Meteor.Error('Image is required for public activities');
    }

    check(formValues.title, String);
    check(formValues.room, String);
    check(formValues.dateStart, String);
    check(formValues.dateEnd, String);
    check(formValues.timePickerStart, String);
    check(formValues.timePickerEnd, String);
    check(formValues.isPublicActivity, Boolean);

    const roomIndex = getRoomIndex(formValues.room);

    try {
      const add = Gatherings.insert(
        {
          authorId: user._id,
          attendees: [],
          authorName: user.username,
          title: formValues.title,
          longDescription: formValues.longDescription,
          room: formValues.room,
          capacity: formValues.capacity || 20,
          roomIndex: roomIndex,
          startDate: formValues.dateStart,
          endDate: formValues.dateEnd,
          startTime: formValues.timePickerStart || undefined,
          endTime: formValues.timePickerEnd || undefined,
          imageUrl: uploadedImage || null,
          isSentForReview: false,
          isPublicActivity: formValues.isPublicActivity,
          isMultipleDay: formValues.isMultipleDay,
          isPublished: true,
          creationDate: new Date()
        },
        () =>
          Meteor.call('createChat', formValues.title, add, (error, result) => {
            if (error) {
              console.log('Chat is not created due to error: ', error);
            }
          })
      );
      return add;
    } catch (e) {
      throw new Meteor.Error(e, "Couldn't add to Collection");
    }
  },

  updateBooking(formValues, bookingId, imageUrl) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    check(formValues.room, String);
    check(formValues.dateStart, String);
    check(formValues.dateEnd, String);
    check(formValues.timePickerStart, String);
    check(formValues.timePickerEnd, String);

    const roomIndex = getRoomIndex(formValues.room);
    const theG = Gatherings.findOne(bookingId);
    if (user._id !== theG.authorId) {
      throw new Meteor.Error('You are not allowed!');
      return false;
    }

    try {
      const add = Gatherings.update(bookingId, {
        $set: {
          title: formValues.title,
          longDescription: formValues.longDescription,
          room: formValues.room,
          roomIndex: roomIndex,
          startDate: formValues.dateStart,
          endDate: formValues.dateEnd,
          startTime: formValues.timePickerStart,
          endTime: formValues.timePickerEnd,
          isPublicActivity: formValues.isPublicActivity,
          isMultipleDay: formValues.isMultipleDay,
          imageUrl,
          latestUpdate: new Date()
        }
      });
      return bookingId;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  deleteBooking(bookingId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
      return false;
    }
    const bookingToDelete = Gatherings.findOne(bookingId);
    if (bookingToDelete.authorId !== user._id) {
      throw new Meteor.Error('You are not allowed!');
      return false;
    }

    try {
      Gatherings.remove(bookingId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  }
});
