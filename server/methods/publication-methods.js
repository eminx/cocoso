import { check } from 'meteor/check';

Meteor.methods({
  createPublication(formValues, imageUrl, linkToDigitalCopy, documentId) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }
    check(formValues.title, String);
    check(formValues.authors, String);
    check(formValues.format, String);
    check(formValues.publishDate, String);
    check(formValues.description, String);
    check(formValues.purchaseInfo, String);
    check(linkToDigitalCopy, String);
    check(imageUrl, String);
    check(documentId, String);

    try {
      const add = Publications.insert({
        adminId: user._id,
        adminUsername: user.username,
        title: formValues.title,
        authors: formValues.authors,
        format: formValues.format,
        publishDate: formValues.publishDate,
        description: formValues.description,
        purchaseInfo: formValues.purchaseInfo,
        imageUrl,
        linkToDigitalCopy,
        documentId,
        isPublished: true,
        creationDate: new Date()
      });
      console.log(add);
      return add;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(
        error,
        "Couldn't add publication to the collection"
      );
    }
  },

  updatePublication(
    publicationId,
    formValues,
    imageUrl,
    linkToDigitalCopy,
    documentId
  ) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }

    const thePublication = Publications.findOne(publicationId);
    if (user._id !== thePublication.adminId) {
      throw new Meteor.Error('You are not allowed!');
    }

    check(publicationId, String);
    check(formValues.title, String);
    check(formValues.authors, String);
    check(formValues.format, String);
    check(formValues.publishDate, String);
    check(formValues.description, String);
    check(formValues.purchaseInfo, String);
    check(imageUrl, String);
    check(linkToDigitalCopy, String);
    check(documentId, String);

    try {
      const add = Publications.update(publicationId, {
        $set: {
          title: formValues.title,
          authors: formValues.authors,
          format: formValues.format,
          publishDate: formValues.publishDate,
          description: formValues.description,
          purchaseInfo: formValues.purchaseInfo,
          imageUrl,
          linkToDigitalCopy,
          documentId
        }
      });
      return publicationId;
    } catch (e) {
      throw new Meteor.Error(e, "Couldn't update the publication");
    }
  },

  deletePublication(publicationId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }
    const publicationToDelete = Publications.findOne(publicationId);
    if (publicationToDelete.adminId !== user._id) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Publications.remove(publicationId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  }
});
