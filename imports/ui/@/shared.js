import { Meteor } from 'meteor/meteor';
import Resizer from 'react-image-file-resizer';
import moment from 'moment';
import i18n from 'i18next';

moment.locale(i18n.language);

const localeSort = (a, b) => a.label.localeCompare(b.label);

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

const parseTitle = (title) => title.replace(/\s+/g, '-').toLowerCase();

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

const parseAllBookingsWithResources = (activities, processes, resources) => {
  if (!activities || !processes || !resources) {
    return;
  }
  const allBookings = [];

  activities.forEach((activity) => {
    if (!activity.datesAndTimes) {
      return;
    }
    activity.datesAndTimes.forEach((recurrence) => {
      const resourceSelected = resources.find(
        (res) => (
          res?._id === activity.resourceId
        )
      );
      if (!resourceSelected) {
        return;
      }
      if (resourceSelected.isCombo) {
        resourceSelected.resourcesForCombo.forEach((resourceForCombo) => {
          if (!resourceForCombo) {
            return;
          }
          allBookings.push({
            title: activity.title,
            start: moment(
              recurrence.startDate + recurrence.startTime,
              'YYYY-MM-DD HH:mm'
            ).toDate(),
            end: moment(
              recurrence.endDate + recurrence.endTime,
              'YYYY-MM-DD HH:mm'
            ).toDate(),
            startDate: recurrence.startDate,
            startTime: recurrence.startTime,
            endDate: recurrence.endDate,
            endTime: recurrence.endTime,
            authorName: activity.authorName,
            longDescription: activity.longDescription,
            isMultipleDay:
              recurrence.isMultipleDay ||
              recurrence.startDate !== recurrence.endDate,
            resource: resourceForCombo.label,
            resourceId: resourceForCombo._id,
            resourceIndex: resourceForCombo.resourceIndex,
            isExclusiveActivity: activity.isExclusiveActivity,
            isPublicActivity: activity.isPublicActivity,
            isWithComboResource: true,
            comboResource: activity.resource,
            comboResourceId: resourceSelected._id,
            imageUrl: activity.imageUrl,
            activityId: activity._id,
          });
        });
      } else {
        allBookings.push({
          title: activity.title,
          start: moment(
            recurrence.startDate + recurrence.startTime,
            'YYYY-MM-DD HH:mm'
          ).toDate(),
          end: moment(
            recurrence.endDate + recurrence.endTime,
            'YYYY-MM-DD HH:mm'
          ).toDate(),
          startDate: recurrence.startDate,
          startTime: recurrence.startTime,
          endDate: recurrence.endDate,
          endTime: recurrence.endTime,
          authorName: activity.authorName,
          longDescription: activity.longDescription,
          isMultipleDay:
            recurrence.isMultipleDay ||
            recurrence.startDate !== recurrence.endDate,
          resource: resourceSelected.label,
          resourceId: resourceSelected._id,
          resourceIndex: resourceSelected.resourceIndex,
          isExclusiveActivity: activity.isExclusiveActivity,
          isPublicActivity: activity.isPublicActivity,
          isWithComboResource: false,
          imageUrl: activity.imageUrl,
          activityId: activity._id,
        });
      }
    });
  });

  processes.forEach((process) => {
    process.meetings.forEach((meeting) => {
      const resourceId = meeting.resourceId || resources.find(r => r.label === meeting.resource)?._id;
      allBookings.push({
        title: process.title,
        start: moment(
          meeting.startDate + meeting.startTime,
          'YYYY-MM-DD HH:mm'
        ).toDate(),
        end: moment(
          meeting.endDate + meeting.endTime,
          'YYYY-MM-DD HH:mm'
        ).toDate(),
        startDate: meeting.startDate,
        startTime: meeting.startTime,
        endDate: meeting.endDate,
        endTime: meeting.endTime,
        authorName: process.adminUsername,
        resource: meeting.resource,
        resourceId,
        resourceIndex: meeting.resourceIndex,
        longDescription: process.description,
        processId: process._id,
        isMultipleDay: false,
        isExclusiveActivity: true,
        isPublicActivity: true,
        imageUrl: process.imageUrl,
        isProcess: true,
        isPrivateProcess: process.isPrivate,
      });
    });
  });

  return allBookings;
};

const getAllBookingsWithSelectedResource = (selectedResource, allBookings) => {
  return allBookings.filter((booking) => {
    if (selectedResource.isCombo) {
      return selectedResource.resourcesForCombo.some((resourceForCombo) => {
        return resourceForCombo._id === booking.resourceId;
      });
    }
    return booking.resourceId === selectedResource._id;
  });
}

const checkAndSetBookingsWithConflict = (selectedBookings, allBookingsWithSelectedResource, selfBookingIdForEdit) => {
  return selectedBookings.map((selectedBooking) => {
    const bookingWithConflict = allBookingsWithSelectedResource
      .filter((item) => item.activityId !== selfBookingIdForEdit)
      .find((occurence) => {
        const selectedStart = `${selectedBooking.startDate} ${selectedBooking.startTime}`;
        const selectedEnd = `${selectedBooking.endDate} ${selectedBooking.endTime}`;
        const existingStart = `${occurence.startDate} ${occurence.startTime}`;
        const existingEnd = `${occurence.endDate} ${occurence.endTime}`;
        
        return isDatesInConflict(existingStart, existingEnd, selectedStart, selectedEnd);
      }
    );

    return {
      ...selectedBooking,
      conflict: bookingWithConflict || null,
    }
  });
}

const isDatesInConflict = (existingStart, existingEnd, selectedStart, selectedEnd) => {
  const dateTimeFormat = 'YYYY-MM-DD HH:mm';

  // If the same values are selected, moment compare returns false. That's why we do:
  if (existingStart === selectedStart && existingEnd === selectedEnd) {
    return true;
  }

  return (
    moment(selectedStart, dateTimeFormat).isBetween(
      existingStart,
      existingEnd,
    ) ||
    moment(selectedEnd, dateTimeFormat).isBetween(
      existingStart,
      existingEnd,
    ) ||
    moment(existingStart, dateTimeFormat).isBetween(
      selectedStart,
      selectedEnd,
    ) ||
    moment(existingEnd, dateTimeFormat).isBetween(
      selectedStart,
      selectedEnd,
    )
  );
}

function appendLeadingZeroes(n){
  if(n <= 9){
    return "0" + n;
  }
  return n
}

function formatDate(date) {
  const formattedDate = appendLeadingZeroes(date.getFullYear()) + "-" + appendLeadingZeroes(date.getMonth() + 1) + "-" + appendLeadingZeroes(date.getDate())
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
  for (i = 0; i < length; i++) {
    colorValues.push(
      `hsl(${share * (i + 1) - share / 2}, ${saturation}, ${lightness})`
    );
  }

  return colorValues;
}

const getNonComboResourcesWithColor = (nonComboResources) => {
  if (!nonComboResources) {
    return;
  }
  const hslValues = getHslValuesFromLength(nonComboResources.length);
  return nonComboResources
    .sort(localeSort)
    .map((res, i) => ({
      ...res,
      color: hslValues[i],
    }));
}

const getComboResourcesWithColor = (comboResources, nonComboResourcesWithColor) => {
  return comboResources
    .sort(localeSort)
    .map((res, i) => {
      const colors = [];
      res.resourcesForCombo.forEach((resCo, i) => {
        const resWithColor = nonComboResourcesWithColor.find(
          (nRes) => resCo.label === nRes.label
        );
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
      const comboLabel = `${res.label} [${res.resourcesForCombo
        .map((item) => item.label)
        .join(',')}]`;
      return { ...res, color, label: comboLabel };
  }); 
}

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
  parseAllBookingsWithResources,
  getAllBookingsWithSelectedResource,
  checkAndSetBookingsWithConflict,
  formatDate,
  getNonComboResourcesWithColor,
  getComboResourcesWithColor
};
