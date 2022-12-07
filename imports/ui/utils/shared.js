import { Meteor } from 'meteor/meteor';
import Resizer from 'react-image-file-resizer';
import moment from 'moment';
import i18n from 'i18next';
import { Slingshot } from 'meteor/edgee:slingshot';

moment.locale(i18n.language);

function localeSort(a, b) {
  return a.label.localeCompare(b.label);
}

function getInitials(string) {
  const names = string.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}

function removeSpace(str) {
  const newStr = str.replace(/\s+/g, '');
  return newStr;
}

function compareForSort(a, b) {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateA - dateB;
}

function parseTitle(title) {
  return title.replace(/\s+/g, '-').toLowerCase();
}

function emailIsValid(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function includesSpecialCharacters(string) {
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (format.test(string)) {
    return true;
  }
  return false;
}

function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
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
      'JPEG|PNG',
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

const slingshotUpload = (directory) => new Slingshot.Upload(directory);

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

function parseAllBookingsWithResources(activities, resources) {
  if (!activities || !resources) {
    return;
  }
  const allBookings = [];

  activities.forEach((activity) => {
    if (!activity.datesAndTimes) {
      return;
    }
    activity.datesAndTimes.forEach((recurrence) => {
      const resourceSelected = resources.find((res) => res?._id === activity.resourceId);
      if (!resourceSelected) {
        return;
      }
      if (resourceSelected.isCombo) {
        resourceSelected.resourcesForCombo.forEach((resourceForCombo) => {
          if (!resourceForCombo) {
            return;
          }
          const resourceForComboReal = resources.find((r) => r._id === resourceForCombo._id);
          if (!resourceForComboReal?.isBookable) {
            return;
          }
          allBookings.push({
            title: activity.title,
            start: moment(recurrence.startDate + recurrence.startTime, 'YYYY-MM-DD HH:mm').toDate(),
            end: moment(recurrence.endDate + recurrence.endTime, 'YYYY-MM-DD HH:mm').toDate(),
            startDate: recurrence.startDate,
            startTime: recurrence.startTime,
            endDate: recurrence.endDate,
            endTime: recurrence.endTime,
            authorName: activity.authorName,
            longDescription: activity.longDescription,
            isMultipleDay: recurrence.isMultipleDay || recurrence.startDate !== recurrence.endDate,
            resource: resourceForCombo.label,
            resourceId: resourceForCombo._id,
            resourceIndex: resourceForCombo.resourceIndex,
            isExclusiveActivity: activity.isExclusiveActivity,
            isPublicActivity: activity.isPublicActivity,
            isProcessMeeting: activity.isProcessMeeting,
            processId: activity.processId,
            isProcessPrivate: activity.isProcessPrivate,
            isWithComboResource: true,
            comboResource: activity.resource,
            comboResourceId: resourceSelected._id,
            imageUrl: activity.imageUrl,
            activityId: activity._id,
          });
        });
      } else {
        if (!resourceSelected.isBookable) {
          return;
        }
        allBookings.push({
          title: activity.title,
          start: moment(recurrence.startDate + recurrence.startTime, 'YYYY-MM-DD HH:mm').toDate(),
          end: moment(recurrence.endDate + recurrence.endTime, 'YYYY-MM-DD HH:mm').toDate(),
          startDate: recurrence.startDate,
          startTime: recurrence.startTime,
          endDate: recurrence.endDate,
          endTime: recurrence.endTime,
          authorName: activity.authorName,
          longDescription: activity.longDescription,
          isMultipleDay: recurrence.isMultipleDay || recurrence.startDate !== recurrence.endDate,
          resource: resourceSelected.label,
          resourceId: resourceSelected._id,
          resourceIndex: resourceSelected.resourceIndex,
          isExclusiveActivity: activity.isExclusiveActivity,
          isPublicActivity: activity.isPublicActivity,
          isProcessMeeting: activity.isProcessMeeting,
          processId: activity.processId,
          isProcessPrivate: activity.isProcessPrivate,
          isWithComboResource: false,
          imageUrl: activity.imageUrl,
          activityId: activity._id,
        });
      }
    });
  });

  return allBookings;
}

function getAllBookingsWithSelectedResource(selectedResource, allBookings) {
  return allBookings.filter((booking) => {
    if (selectedResource.isCombo) {
      return selectedResource.resourcesForCombo.some(
        (resourceForCombo) => resourceForCombo._id === booking.resourceId
      );
    }
    return booking.resourceId === selectedResource._id;
  });
}

function isDatesInConflict(existingStart, existingEnd, selectedStart, selectedEnd) {
  const dateTimeFormat = 'YYYY-MM-DD HH:mm';

  // If the same values are selected, moment compare returns false. That's why we do:
  if (existingStart === selectedStart && existingEnd === selectedEnd) {
    return true;
  }

  return (
    moment(selectedStart, dateTimeFormat).isBetween(existingStart, existingEnd) ||
    moment(selectedEnd, dateTimeFormat).isBetween(existingStart, existingEnd) ||
    moment(existingStart, dateTimeFormat).isBetween(selectedStart, selectedEnd) ||
    moment(existingEnd, dateTimeFormat).isBetween(selectedStart, selectedEnd)
  );
}

function checkAndSetBookingsWithConflict(
  selectedBookings,
  allBookingsWithSelectedResource,
  selfBookingIdForEdit
) {
  return selectedBookings.map((selectedBooking) => {
    const bookingWithConflict = allBookingsWithSelectedResource
      .filter((item) => !selfBookingIdForEdit || item.activityId !== selfBookingIdForEdit)
      .find((occurence) => {
        const selectedStart = `${selectedBooking.startDate} ${selectedBooking.startTime}`;
        const selectedEnd = `${selectedBooking.endDate} ${selectedBooking.endTime}`;
        const existingStart = `${occurence.startDate} ${occurence.startTime}`;
        const existingEnd = `${occurence.endDate} ${occurence.endTime}`;
        return isDatesInConflict(existingStart, existingEnd, selectedStart, selectedEnd);
      });

    return {
      ...selectedBooking,
      conflict: bookingWithConflict || null,
    };
  });
}

function appendLeadingZeroes(n) {
  if (n <= 9) {
    return `0${n}`;
  }
  return n;
}

function formatDate(date) {
  const formattedDate = `${appendLeadingZeroes(date.getFullYear())}-${appendLeadingZeroes(
    date.getMonth() + 1
  )}-${appendLeadingZeroes(date.getDate())}`;
  return formattedDate;
}

function getHslValuesFromLength(length) {
  if (typeof length !== 'number') {
    return null;
  }

  const saturation = '75%';
  const lightness = '40%';

  const colorValues = [];
  const share = Math.round(360 / length);
  for (let i = 0; i < length; i += 1) {
    colorValues.push(`hsl(${share * (i + 1) - share / 2}, ${saturation}, ${lightness})`);
  }

  return colorValues;
}

function getNonComboResourcesWithColor(nonComboResources) {
  if (!nonComboResources) {
    return;
  }
  const hslValues = getHslValuesFromLength(nonComboResources.length);
  return nonComboResources.sort(localeSort).map((res, i) => {
    return {
      ...res,
      color: hslValues[i],
    };
  });
}

function getComboResourcesWithColor(comboResources, nonComboResourcesWithColor) {
  return comboResources.sort(localeSort).map((res) => {
    const colors = [];
    res.resourcesForCombo.forEach((resCo) => {
      const resWithColor = nonComboResourcesWithColor.find((nRes) => resCo.label === nRes.label);
      if (!resWithColor) {
        return;
      }
      colors.push(resWithColor.color);
    });
    let color = 'linear-gradient(to right, ';
    colors.forEach((c, i) => {
      color += c;
      if (i < colors.length - 1) {
        color += ', ';
      } else {
        color += ')';
      }
    });
    return { ...res, color, label: res.label };
  });
}

function getFullName(user) {
  const { firstName, lastName } = user;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || '';
}

export {
  localeSort,
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
  parseAllBookingsWithResources,
  getAllBookingsWithSelectedResource,
  checkAndSetBookingsWithConflict,
  formatDate,
  getNonComboResourcesWithColor,
  getComboResourcesWithColor,
  getFullName,
};
