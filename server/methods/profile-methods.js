import { Meteor } from 'meteor/meteor';

Meteor.methods({
  saveUserInfo(values) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    check(values.firstName, String);
    check(values.lastName, String);

    try {
      Meteor.users.update(user._id, {
        $set: {
          firstName: values.firstName,
          lastName: values.lastName
        }
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  }
});
