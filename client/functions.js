import { Meteor } from 'meteor/meteor';
import Resizer from 'react-image-file-resizer';

import Activities from './RouterComponents/activities/ActivitiesContainer';
import ProcessesList from './RouterComponents/processes/ProcessesListContainer';
import Calendar from './RouterComponents/CalendarContainer';
import Works from './RouterComponents/works/Works';
import Page from './RouterComponents/pages/Page';

const getInitials = (string) => {
  var names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const removeSpace = (str) => {
  str = str.replace(/\s+/g, '');
  return str;
};

const compareForSort = (a, b) => {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateA - dateB;
};

const parseTitle = (title) => title.replace(/ /g, '-').toLowerCase();

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

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const call = (method, ...parameters) =>
  new Promise((resolve, reject) => {
    Meteor.call(method, ...parameters, (error, respond) => {
      if (error) reject(error);
      resolve(respond);
    });
  });

const resizeImage = (image, desiredImageWidth) =>
  new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      image,
      desiredImageWidth,
      400,
      'JPEG',
      95,
      0,
      (uri) => {
        if (!uri) {
          reject({ reason: 'image cannot be resized' });
        }
        const uploadableImage = dataURLtoFile(uri, image.name);
        resolve(uploadableImage);
      },
      'base64'
    );
  });

const uploadImage = (image, directory) =>
  new Promise((resolve, reject) => {
    const upload = slingshotUpload(directory);
    upload.send(image, (error, downloadUrl) => {
      if (error) {
        reject(error);
      }
      resolve(downloadUrl);
    });
  });

const slingshotUpload = (directory) => new Slingshot.Upload(directory);

const getHomeRoute = (currentHost) => {
  const menu = currentHost && currentHost.settings && currentHost.settings.menu;
  if (!menu || !menu[0]) {
    return null;
  }

  switch (menu[0].name) {
    case 'activities':
      return Activities;
    case 'processes':
      return ProcessesList;
    case 'calendar':
      return Calendar;
    case 'works':
      return Works;
    case 'info':
      return Page;
    default:
      return null;
  }
};

export {
  getInitials,
  removeSpace,
  compareForSort,
  parseTitle,
  emailIsValid,
  includesSpecialCharacters,
  call,
  resizeImage,
  uploadImage,
  dataURLtoFile,
  getHomeRoute,
};
