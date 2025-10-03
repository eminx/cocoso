import { Meteor } from 'meteor/meteor';
import Platform from './platform';

Meteor.methods({
  async createPlatform(values) {
    if (await Platform.findOneAsync()) {
      throw new Meteor.Error('Platform already exists');
    }
    const currentUser = Meteor.user();
    if (!currentUser || !currentUser.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      await Platform.insertAsync({ ...values, createdAt: new Date() });
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

  async updatePlatformSettings(values) {
    const currentUser = Meteor.user();
    if (!currentUser || !currentUser.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    const thePlatform = await Platform.findOneAsync();
    try {
      await Platform.updateAsync(thePlatform._id, {
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

  async updatePlatformRegistrationIntro(registrationIntro) {
    const currentUser = Meteor.user();

    if (!currentUser || !currentUser.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    const thePlatform = await Platform.findOneAsync();
    try {
      await Platform.updateAsync(thePlatform._id, {
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

  async setUserSuperAdmin(userId) {
    if (!Meteor.user()) {
      return;
    }

    const currentUserId = Meteor.userId();
    if (currentUserId !== userId) {
      return;
    }

    if (await Platform.findOneAsync()) {
      return;
    }

    const allUsers = await Meteor.users.find().fetchAsync();
    if (allUsers.length !== 1) {
      return;
    }

    await Meteor.users.updateAsync(currentUserId, {
      $set: {
        isSuperAdmin: true,
      },
    });
  },
});
