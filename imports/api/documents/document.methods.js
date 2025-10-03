import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';
import Documents from './document';
import Hosts from '../hosts/host';
import { isAdmin } from '../users/user.roles';

Meteor.methods({
  async getDocumentsByAttachments(attachedTo) {
    const sort = {};
    const fields = Documents.publicFields;
    return await Documents.find({ attachedTo }, { sort, fields }).fetchAsync();
  },

  async createDocument(documentLabel, documentUrl, contextType, attachedTo) {
    const user = await Meteor.userAsync();
    if (!user) {
      return;
    }

    const host = getHost(this);

    try {
      return await Documents.insertAsync({
        host,
        documentLabel,
        documentUrl,
        contextType,
        attachedTo,
        uploadedUsername: user.username,
        uploadedBy: user._id,
        uploadedByName: user.username,
        creationDate: new Date(),
      });
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't create the document");
    }
  },

  async removeDocument(documentId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      await Documents.removeAsync(documentId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't delete the document");
    }
  },
});
