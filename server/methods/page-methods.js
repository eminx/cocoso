Meteor.methods({
  createPage(formValues) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    check(formValues.description, String);

    try {
      const newPageId = Gatherings.insert({
        authorId: user._id,
        authorName: user.username,
        title: formValues.title,
        longDescription: formValues.description,
        isPublished: true,
        creationDate: new Date()
      });
      return newPageId;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  },

  updatePage(formValues, pageId) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    check(formValues.description, String);

    try {
      const thePage = Pages.update(pageId, {
        $set: {
          title: formValues.title,
          longDescription: formValues.longDescription,
          room: formValues.room,
          roomIndex: roomIndex,
          startDate: formValues.dateStart,
          endDate: formValues.dateEnd,
          startTime: formValues.timePickerStart,
          endTime: formValues.timePickerEnd,
          duration: formValues.duration,
          latestUpdate: new Date()
        }
      });
      return pageId;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add to Collection");
    }
  }
});
