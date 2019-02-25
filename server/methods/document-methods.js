Meteor.methods({
  createDocument(documentLabel, documentUrl, contextType, contextId) {
    const user = Meteor.user();
    if (!user) {
      return;
    }
    check(documentLabel, String);
    check(documentUrl, String);
    check(contextType, String);
    check(contextId, String);
    try {
      const theNewDocId = Documents.insert({
        documentLabel,
        documentUrl,
        contextType,
        contextId,
        uploadedUsername: user.username,
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
