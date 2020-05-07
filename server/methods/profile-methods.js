import { Meteor } from 'meteor/meteor';
import { getHost } from './shared';

Meteor.methods({
  saveUserInfo(values) {
    console.log(values);
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    check(values.firstName, String);
    check(values.lastName, String);
    check(values.bio, String);

    try {
      Meteor.users.update(user._id, {
        $set: {
          firstName: values.firstName,
          lastName: values.lastName,
          bio: values.bio
        }
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  deleteAccount() {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('You are not a member anyways!');
    }
    try {
      Meteor.users.remove(userId);
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  }
});
