import { Meteor } from 'meteor/meteor';
import { getHost } from './shared';

const s3Settings = Meteor.settings.AWSs3;

Slingshot.fileRestrictions('groupImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024
});

Slingshot.fileRestrictions('groupDocumentUpload', {
  allowedFileTypes: ['application/pdf', 'image/png', 'image/jpeg'],
  maxSize: 5 * 1000 * 1000
});

Slingshot.fileRestrictions('pageImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024
});

Slingshot.fileRestrictions('activityImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024
});

Slingshot.createDirective('groupImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize: function() {
    if (!this.userId) {
      var message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key: function(file) {
    var currentUser = Meteor.user();
    return currentUser.username + '/' + file.name;
  }
});

Slingshot.createDirective('groupDocumentUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketReadingMaterials,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize: function() {
    if (!this.userId) {
      var message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key: function(file) {
    var currentUser = Meteor.user();
    return currentUser.username + '/' + file.name;
  }
});

Slingshot.createDirective('pageImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize: function() {
    if (!this.userId) {
      var message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key: function(file) {
    var currentUser = Meteor.user();
    return currentUser.username + '/' + file.name;
  }
});

Slingshot.createDirective('activityImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize: function() {
    if (!this.userId) {
      var message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key: function(file) {
    var currentUser = Meteor.user();
    return currentUser.username + '/' + file.name;
  }
});

Meteor.publish('images', function() {
  return Images.find(
    {},
    {
      // fields: {
      // isSentForReview: 0,
      // phoneNumber: 0
      // }
    }
  );
});

Meteor.methods({
  addGatheringImageInfo(newGatheringId, downloadUrl, timeStamp, currentUserId) {
    const host = getHost(this);

    if (Meteor.userId() === currentUserId) {
      try {
        Images.insert({
          host,
          gatheringId: newGatheringId,
          imageurl: downloadUrl,
          time: timeStamp,
          uploadedBy: currentUserId
        });
      } catch (e) {
        throw new Meteor.error(e);
      }
    }
  }
});
