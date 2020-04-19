import { Meteor } from 'meteor/meteor';
import { getHost } from './shared';

Meteor.methods({
  createDocument(documentLabel, documentUrl, contextType) {
    const user = Meteor.user();
    if (!user) {
      return;
    }

    console.log(documentLabel, documentUrl, contextType);

    check(documentLabel, String);
    check(documentUrl, String);
    check(contextType, String);

    const host = getHost(this);

    try {
      const theNewDocId = Documents.insert({
        host,
        documentLabel,
        documentUrl,
        contextType,
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
  },

  removeManual(documentId) {
    const user = Meteor.user();
    if (!user || !user.isSuperAdmin) {
      throw new Meteor.Error(error, 'You do not have the priveleges');
    }

    try {
      Documents.remove(documentId);
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't delete the document");
    }
  }
});
