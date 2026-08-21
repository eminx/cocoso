import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { getHost } from '../_utils/shared';
import Documents from './document';
import Hosts from '../hosts/host';
import Groups from '../groups/group';
import Works from '../works/work';

import { isAdmin } from '../users/user.roles';
import { uploadDocumentToS3 } from '../_utils/services/aws.upload';

Meteor.methods({
  async getDocumentsByAttachments(attachedTo) {
    const sort = {};
    const fields = Documents.publicFields;
    return await Documents.find({ attachedTo }, { sort, fields }).fetchAsync();
  },

  async createDocument(uploadableFile, itemId, contextType) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error(
        'not-authorized',
        'You must be logged in to upload documents'
      );
    }

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (contextType === 'groups') {
      const group = await Groups.findOneAsync({ _id: itemId });
      if (!group) {
        throw new Meteor.Error('not-found', 'Group not found');
      }
      const member = group.members.find(
        (member) => member.memberId === user._id
      );
      if (!member || !member.isAdmin) {
        throw new Meteor.Error(
          'not-authorized',
          'You must be an admin of the group to upload documents'
        );
      }
    } else if (contextType === 'works') {
      const work = await Works.findOneAsync({ _id: itemId });
      if (!work || work.authorId !== user._id) {
        throw new Meteor.Error(
          'not-found',
          'You must be author of the work to upload documents'
        );
      }
    } else if (contextType === 'resources') {
      if (!isAdmin(user, currentHost)) {
        throw new Meteor.Error(
          'not-authorized',
          'You must be an admin to upload documents'
        );
      }
    }

    const buffer = Buffer.from(uploadableFile.fileData, 'base64');
    const key = `documents/${user.username}/${Random.id()}/${
      uploadableFile.fileName
    }`;
    const documentUrl = await uploadDocumentToS3(
      buffer,
      key,
      uploadableFile.contentType
    );
    console.log('Document uploaded to S3:', documentUrl);

    try {
      return await Documents.insertAsync({
        host,
        documentLabel: uploadableFile.fileName,
        documentUrl,
        contextType,
        contentType: uploadableFile.contentType,
        attachedTo: itemId,
        uploadedUsername: user.username,
        uploadedBy: user._id,
        uploadedByName: user.username,
        creationDate: new Date(),
      });
    } catch (error) {
      console.log('Error creating document:', error);
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
