import { Email } from 'meteor/email';

function isValidEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

Meteor.methods({
  sendEmail: (id, subjectEmail, textEmail, isNewUser) => {
    check([id, subjectEmail, textEmail], [String]);
    const fromEmail = Meteor.settings.mailCredentials.smtp.fromEmail;
    let toEmail;

    if (isValidEmail(id)) {
      toEmail = id;
    } else if (id.length === 17) {
      toEmail = Meteor.users.findOne({ _id: id }).emails[0].address;
    } else {
      toEmail = Meteor.users.findOne({ username: id }).emails[0].address;
    }

    const data = {
      from: fromEmail,
      to: toEmail,
      subject: subjectEmail,
      text: textEmail
    };

    Email.send(data);
  }
});
