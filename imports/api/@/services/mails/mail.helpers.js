const isValidEmail = (email) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const getEmailBody = (email, username) => {
  return `${email.appeal} ${username},\n${email.body}`;
};

export {
  isValidEmail,
  getEmailBody
};