import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { getHost } from '../_utils/shared';
import Documents from './document';
import Hosts from '../hosts/host';
import { isAdmin } from '../users/user.roles';
import { uploadDocumentToS3 } from '../_utils/services/aws.upload';

Meteor.methods({
  async getDocumentsByAttachments(attachedTo) {
    const sort = {};
    const fields = Documents.publicFields;
    return await Documents.find({ attachedTo }, { sort, fields }).fetchAsync();
  },

  async createDocument(fileBase64, fileName, contentType, contextType, attachedTo) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to upload documents');
    }

    const host = getHost(this);

    const buffer = Buffer.from(fileBase64, 'base64');
    const safeFileName = fileName.replace(/\s+/g, '-').toLowerCase();
    const key = `documents/${user.username}/${Random.id()}/${safeFileName}`;
    const documentUrl = await uploadDocumentToS3(buffer, key, contentType);

    try {
      return await Documents.insertAsync({
        host,
        documentLabel: fileName,
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
