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

  // Hosts.insert({
  //   host: 'localhost:3000',
  //   settings: {
  //     name: 'Localhost Blabla',
  //     email: 'none',
  //     address: 'Main str.1',
  //     city: 'Arugam Bay',
  //     country: 'Sri Lanka',
  //     mainColor: {
  //       hsl: {
  //         h: '95',
  //         s: 0.8,
  //         l: 0.35,
  //       },
  //     },
  //     menu: [
  //       {
  //         label: 'INFOS',
  //         name: 'info',
  //         isVisible: true,
  //         isHomePage: false,
  //       },
  //       {
  //         label: 'MARKTPLATZ',
  //         name: 'works',
  //         isVisible: true,
  //         isHomePage: false,
  //       },
  //       {
  //         label: 'GATHERINGS',
  //         name: 'activities',
  //         isVisible: true,
  //         isHomePage: true,
  //       },
  //       {
  //         label: 'K A L E N D E R',
  //         name: 'calendar',
  //         isVisible: false,
  //         isHomePage: false,
  //       },
  //       {
  //         label: 'MITGLIEDER',
  //         name: 'members',
  //         isVisible: true,
  //         isHomePage: false,
  //       },
  //       {
  //         label: 'PROJEKTS',
  //         name: 'processes',
  //         isVisible: false,
  //         isHomePage: false,
  //       },
  //     ],
  //   },
  // });
});
