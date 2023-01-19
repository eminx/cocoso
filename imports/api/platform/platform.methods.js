import { Meteor } from 'meteor/meteor';
import Platform from './platform';

Meteor.methods({
  createNewPlatform(values) {
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

  getPlatform() {
    try {
      return Platform.findOne();
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
