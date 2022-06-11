import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Works from '../../api/works/work';

import './api';
import './migrations';

Meteor.startup(() => {
  const smtp = Meteor.settings.mailCredentials.smtp;

  process.env.MAIL_URL = `smtps://${encodeURIComponent(smtp.userName)}:${smtp.password}@${
    smtp.host
  }:${smtp.port}`;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    const newUrl = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${newUrl}`;
  };

  Works.find().forEach((work) => {
    const author = Meteor.users.findOne({ _id: work.authorId });
    Works.update(
      {
        _id: work._id,
      },
      {
        $set: {
          authorAvatar: author?.avatar?.src,
        },
      }
    );
  });
});
