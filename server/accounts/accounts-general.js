import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const publicSettings = Meteor.settings.public;
const contextName = publicSettings.contextName;

getWelcomeEmailText = username => {
  return `Hi ${username},\n\nWe are delighted to have you at ${contextName}.\nBy being a subscriber, you can easily take part in our public events and groups.\n\nRegards,\n${contextName} Team`;
};

Accounts.onCreateUser((options, user) => {
  user.attending = [];
  user.groups = [];
  user.notifications = [];
  console.log(user.emails[0].address, user.username);
  console.log(contextName, publicSettings);
  // Meteor.call(
  //   'sendEmail',
  //   user.emails[0].address,
  //   'Welcome to ' + contextName,
  //   getWelcomeEmailText(user.username),
  //   true // is new user
  // );
  return user;
});
