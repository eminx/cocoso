import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

getWelcomeEmailText = username => {
  return `Hi ${username},\n\nWe are delighted to have you at Skogen.\nBy being a subscriber, you can easily take part in our public events and groups.\n\nRegards,\nSkogen Team`;
};

Accounts.onCreateUser((options, user) => {
  user.attending = [];
  user.groups = [];
  user.notifications = [];
  Meteor.call(
    'sendEmail',
    user.emails[0].address,
    'Welcome to Skogen',
    getWelcomeEmailText(user.username),
    true // is new user
  );
  return user;
});
