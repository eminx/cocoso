import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  const smtp = Meteor.settings.mailCredentials.smtp;

  process.env.MAIL_URL =
    'smtps://' +
    encodeURIComponent(smtp.userName) +
    ':' +
    smtp.password +
    '@' +
    smtp.host +
    ':' +
    smtp.port;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;

  // Groups.find().forEach((group) => {
  //   Processes.insert(group);
  // });

  // Gatherings.find().forEach((gathering) => {
  //   Activities.insert(gathering);
  // });

  // Places.find().forEach((place) => {
  //   Resources.insert(place);
  // });

  Meteor.users.find().forEach((user) => {
    // Meteor.users.update(user._id, {
    //   $set: { processes: user.groups || [] },
    // });
    if (!user.username) {
      Meteor.users.remove(user._id);
    }
  });
});
