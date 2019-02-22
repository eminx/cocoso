Meteor.methods({
  createDocument(
    documentLabel,
    documentUrl,
    uploadedUsername,
    contextType,
    contextId
  ) {
    const user = Meteor.user();
    if (!user) {
      return;
    }
    check(documentLabel, String);
    check(documentUrl, String);
    check(contextType, String);
    check(uploadedUsername, String);
    try {
      const theNewDocId = Documents.insert({
        documentLabel,
        documentUrl,
        contextType,
        uploadedUsername,
        uploadedBy: user._id,
        uploadedByName: user.username,
        creationDate: new Date()
      });
      return theNewDocId;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't create the document");
    }
  }
});
