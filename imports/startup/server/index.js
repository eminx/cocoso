import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Hosts from '../../api/hosts/host';

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

  Hosts.find().forEach((host) => {
    const members = host.members;
    const newMembers = members.map((m) => {
      const member = Meteor.users.findOne({ _id: m.id });
      if (!member) {
        return;
      }
      const avatar = member.avatar ? member.avatar.src : null;
      return {
        ...m,
        avatar: avatar,
      };
    });
    Hosts.update(
      { _id: host._id },
      {
        $set: {
          members: newMembers,
        },
      }
    );
  });
});
