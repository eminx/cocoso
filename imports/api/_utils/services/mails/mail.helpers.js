const isValidEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const getEmailBody = (email, username) =>
  `${email.appeal} ${username},\n${email.body}`;

const extractEmailAddress = (emailString) => {
  // Match email in brackets: "Name <email@domain.com>" or just return the string if no brackets
  const bracketMatch = emailString.match(/<([^>]+)>/);
  return bracketMatch ? bracketMatch[1] : emailString;
};

export { isValidEmail, getEmailBody, extractEmailAddress };
