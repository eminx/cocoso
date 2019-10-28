import { Email } from 'meteor/email'

function isValidEmail (email) {
  var re = /\S+@\S+\.\S+/
  return re.test(email)
}

Meteor.methods({
  sendEmail: (id, subjectEmail, textEmail, isNewUser) => {
    // if (!isNewUser && !Meteor.userId()) {
    //   return false;
    // }

    check([id, subjectEmail, textEmail], [String])
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    var fromEmail = Meteor.settings.mailCredentials.smtp.fromEmail
    var toEmail

    if (isValidEmail(id)) {
      toEmail = id
    } else if (id.length === 17) {
      toEmail = Meteor.users.findOne({ _id: id }).emails[0].address
    } else {
      toEmail = Meteor.users.findOne({ username: id }).emails[0].address
    }

    Email.send({
      from: fromEmail,
      to: toEmail,
      subject: subjectEmail,
      text: textEmail
    })
  }
})
