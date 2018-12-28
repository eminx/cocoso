import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Meteor.users.find().forEach(user => {
    if (!user.notifications) {
      Meteor.users.update(user._id, {
        $set: {
          notifications: []
        }
      });
    }
  });
});
