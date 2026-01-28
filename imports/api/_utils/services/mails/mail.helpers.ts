interface EmailTemplate {
  appeal: string;
  body: string;
}

const isValidEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const getEmailBody = (email: EmailTemplate, username: string): string =>
  `${email.appeal} ${username},\n${email.body}`;

const extractEmailAddress = (emailString: string): string => {
  // Match email in brackets: "Name <email@domain.com>" or just return the string if no brackets
  const bracketMatch = emailString.match(/<([^>]+)>/);
  return bracketMatch ? bracketMatch[1] : emailString;
};

export { isValidEmail, getEmailBody, extractEmailAddress };
export type { EmailTemplate };
