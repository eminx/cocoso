const isValidEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const getEmailBody = (email, username) => `${email.appeal} ${username},\n${email.body}`;

export { isValidEmail, getEmailBody };
