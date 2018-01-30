// Slingshot.fileRestrictions("GatheringImage", {
//   allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
//   maxSize: 4 * 2000 * 2000 // 2 MB (use null for unlimited)
// });


// Slingshot.createDirective("GatheringImage", Slingshot.S3Storage, {
//   bucket: "nodal-gatherings", // change this to your s3's bucket name

//   acl: "public-read",

//   authorize: function (file, metaContext) {
    
//     //Deny uploads if user is not logged in.
//     if (!this.userId) {
//       var message = "Please login before posting files";
//       throw new Meteor.Error("Login Required", message);
//     }

//     return true;
//   },

//   key: function (file, metaContext) {
//     // User's image url with ._id attached:

//     return metaContext.avatarId + "/" + Date.now() + "-" + file.name;
//   }
// });