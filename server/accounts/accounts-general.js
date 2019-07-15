import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

getWelcomeEmailText = username => {
  return `Hi ${username},\n\nWe are delighted to have you at Skogen.\nBy being a subscriber, you can easily take part in our public events and groups.\n\nRegards,\nSkogen Team`;
};

Accounts.onCreateUser((options, user) => {
  user.attending = [];
  user.groups = [];
  user.notifications = [];
  // if (user.services.facebook) {
  //   user.username = user.services.facebook.name;
  //   user.emails = [{ address: user.services.facebook.email }];
  // } else if (user.services.google) {
  //   user.username = user.services.google.name;
  //   user.emails = [{ address: user.services.google.email }];
  // }
  Meteor.call(
    'sendEmail',
    user.emails[0].address,
    'Welcome to Skogen',
    getWelcomeEmailText(user.username),
    true // is new user
  );
  return user;
});
