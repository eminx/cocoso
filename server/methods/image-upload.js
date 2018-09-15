import { Meteor } from 'meteor/meteor';
const s3Settings = Meteor.settings.AWSs3;

Slingshot.fileRestrictions('groupImageUpload', {
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
    var currentUserId = Meteor.userId();
    return currentUserId + file.name;
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
    if (Meteor.userId() === currentUserId) {
      try {
        Images.insert({
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
