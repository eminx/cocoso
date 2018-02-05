import { Meteor } from 'meteor/meteor';
const s3Settings = Meteor.settings.private.s3;
console.log("s3Settings", s3Settings);

Slingshot.fileRestrictions("gatheringImageUpload", {
  allowedFileTypes: ["image/png", "image/jpeg"],
  maxSize: 5 * 3024 * 3024,
});

Slingshot.createDirective("gatheringImageUpload", Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSAccessKeyId,
  bucket: s3Settings.AWSBucketName,
  acl: "public-read",
  region: s3Settings.AWSRegion,

  authorize: function () {
    if (!this.userId) {
      var message = "Please login before posting images";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {
    var currentUserId = Meteor.user().emails[0].address;
    return currentUserId + "/" + file.name;
  }

});

Meteor.publish('gatheringImage', function () {
  return Images.find({}, {
    // fields: {
    	// isSentForReview: 0,
    	// phoneNumber: 0
    // }
  });
});