import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

const s3Settings = Meteor.settings.AWSs3;

Slingshot.fileRestrictions('processImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024,
});

Slingshot.fileRestrictions('hostLogoUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 1008 * 1008,
});

Slingshot.fileRestrictions('workImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024,
});

Slingshot.fileRestrictions('processDocumentUpload', {
  allowedFileTypes: ['application/pdf', 'image/png', 'image/jpeg'],
  maxSize: 5 * 1000 * 1000,
});

Slingshot.fileRestrictions('pageImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024,
});

Slingshot.fileRestrictions('activityImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024,
});

Slingshot.fileRestrictions('avatarImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 1024 * 1024,
});

Slingshot.fileRestrictions('resourceImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024,
});

Slingshot.createDirective('avatarImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize() {
    if (!this.userId) {
      const message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key(file) {
    const currentUser = Meteor.user();
    return `avatars/${currentUser.username}/${file.name}`;
  },
});

Slingshot.createDirective('workImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize() {
    if (!this.userId) {
      const message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key(file) {
    const currentUser = Meteor.user();
    return `${currentUser.username}/${file.name}`;
  },
});

Slingshot.createDirective('resourceImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize() {
    if (!this.userId) {
      const message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key(file) {
    const currentUser = Meteor.user();
    return `${currentUser.username}/${file.name}`;
  },
});


Slingshot.createDirective('processImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize() {
    if (!this.userId) {
      const message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key(file) {
    const currentUser = Meteor.user();
    return `${currentUser.username}/${file.name}`;
  },
});

Slingshot.createDirective('hostLogoUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize() {
    if (!this.userId) {
      const message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key(file) {
    const currentUser = Meteor.user();
    return `${currentUser.username}/${file.name}`;
  },
});

Slingshot.createDirective('processDocumentUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketReadingMaterials,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize() {
    if (!this.userId) {
      const message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key(file) {
    const currentUser = Meteor.user();
    return `${currentUser.username}/${file.name}`;
  },
});

Slingshot.createDirective('pageImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize() {
    if (!this.userId) {
      const message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key(file) {
    const currentUser = Meteor.user();
    return `${currentUser.username}/${file.name}`;
  },
});

Slingshot.createDirective('activityImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize() {
    if (!this.userId) {
      const message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key(file) {
    const currentUser = Meteor.user();
    return `${currentUser.username}/${file.name}`;
  },
});
