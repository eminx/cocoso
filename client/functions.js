import { Meteor } from 'meteor/meteor';

const getInitials = string => {
  var names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const removeSpace = str => {
  str = str.replace(/\s+/g, '');
  return str;
};

const compareForSort = (a, b) => {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateA - dateB;
};

const parseTitle = title => title.replace(/ /g, '-').toLowerCase();

function emailIsValid(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function includesSpecialCharacters(string) {
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (format.test(string)) {
    return true;
  } else {
    return false;
  }
}

const callWithPromise = (method, ...parameters) =>
  new Promise((resolve, reject) => {
    Meteor.call(method, ...parameters, (error, respond) => {
      if (error) reject(error);
      resolve(respond);
    });
  });

export {
  getInitials,
  removeSpace,
  compareForSort,
  parseTitle,
  emailIsValid,
  includesSpecialCharacters,
  callWithPromise
};
