Slingshot.fileRestrictions("gatheringImageUpload", {
  allowedFileTypes: ["image/png", "image/jpeg"],
  maxSize: 2 * 1024 * 1024,
});

Slingshot.createDirective("gatheringImageUpload", Slingshot.S3Storage, {
  AWSAccessKeyId: "AKIAJHYRXJXFQWVLBLLA",
  AWSSecretAccessKey: "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",
  bucket: "nodal-gatherings",
  acl: "public-read",
  region: "eu-central-1",

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