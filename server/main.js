import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  const smtp = Meteor.settings.mailCredentials.smtp;

  // Meteor.users.find().forEach((user) => {
  //   Meteor.users.update(user._id, {
  //     $set: {
  //       memberships: [
  //         {
  //           host: 'www.nodal.app',
  //           hostId: '3Er9qxkYQGB9obsEF',
  //           role: 'contributor',
  //           date: new Date(),
  //         },
  //       ],
  //     },
  //   });

  //   Hosts.update('3Er9qxkYQGB9obsEF', {
  //     $push: {
  //       members: {
  //         id: user._id,
  //         email: user.emails[0].address,
  //         role: 'contributor',
  //         date: new Date(),
  //       },
  //     },
  //   });
  // });

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
});
