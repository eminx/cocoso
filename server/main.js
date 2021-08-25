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
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    url = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${url}`;
  };

  // Hosts.update(
  //   {},
  //   {
  //     $set: {
  //       emails: [
  //         {
  //           title: 'Welcome Email',
  //           subject: 'Welcome as a participant',
  //           appeal: 'Dear',
  //           body: 'Welcome! As a participant, you may attend our processes and activities. Look forward to hanging out with you!',
  //         },
  //         {
  //           title: 'New Contributor',
  //           subject: 'You are now a contributor',
  //           appeal: 'Dear',
  //           body: 'You are now verified to be a contributor in our space. This means that you are privileged to create public activities & processes, publish your works, and book resources in our community. \nLook forward!',
  //         },
  //         {
  //           title: 'New Admin',
  //           subject: 'You are now an admin',
  //           appeal: 'Dear',
  //           body: 'You are now registered as an admin in our space. This means that in addition to the privileges of being a contributor; you may create new pages and configure a bunch of options in our shared system. Please use your powers responsible, and enjoy. \nLook forward!',
  //         },
  //       ],
  //     },
  //   }
  // );
});
