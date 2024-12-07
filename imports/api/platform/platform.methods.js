import { Meteor } from 'meteor/meteor';
import Platform from './platform';

Meteor.methods({
  createPlatform(values) {
    if (Platform.findOne()) {
      throw new Meteor.Error('Platform already exists');
    }
    const currentUser = Meteor.user();
    if (!currentUser || !currentUser.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Platform.insert({ ...values, createdAt: new Date() });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  async getPlatform() {
    try {
      return await Platform.findOneAsync();
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  updatePlatformSettings(values) {
    const currentUser = Meteor.user();
    if (!currentUser || !currentUser.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    const thePlatform = Platform.findOne();
    try {
      Platform.update(thePlatform._id, {
        $set: {
          ...values,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  updatePlatformRegistrationIntro(registrationIntro) {
    const currentUser = Meteor.user();

    if (!currentUser || !currentUser.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    const thePlatform = Platform.findOne();
    try {
      Platform.update(thePlatform._id, {
        $set: {
          registrationIntro,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  setUserSuperAdmin(userId) {
    if (!Meteor.user()) {
      console.log('no user');
      return;
    }

    const currentUserId = Meteor.userId();
    if (currentUserId !== userId) {
      console.log('not same id');
      return;
    }

    if (Platform.findOne()) {
      console.log('platform exists');
      return;
    }

    const allUsers = Meteor.users.find().fetch();
    if (allUsers.length !== 1) {
      console.log('user cound:', allUsers.length);
      return;
    }

    Meteor.users.update(currentUserId, {
      $set: {
        isSuperAdmin: true,
      },
    });
  },
});
