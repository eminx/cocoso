import { Meteor } from 'meteor/meteor';
import Resizer from 'react-image-file-resizer';
import moment from 'moment';
import i18n from 'i18next';

moment.locale(i18n.language);

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
        isPublicActivity: true,
        imageUrl: process.imageUrl,
        isProcess: true,
        isPrivateProcess: process.isPrivate,
      });
    });
  });

  return allBookings;
};

const parseComboResourcesWithAllData = (resources) => {
  return resources.map((resource) => {
    if (resource.isCombo) {
      return {
        ...resource,
        resourcesForCombo: resource.resourcesForCombo.map(rId => {
          return resources.find(res =>  res._id === rId)
        })
      }
    }
    return resource;
  })
}

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

const checkAndSetBookingsWithConflict = (selectedBookings, allBookingsWithSelectedResource) => {
  const dateTimeFormat = 'YYYY-MM-DD HH:mm';

  return selectedBookings.map((selectedBooking) => {
    const bookingWithConflict = allBookingsWithSelectedResource.find(
      (occurence) => {
        const selectedStart = `${selectedBooking.startDate} ${selectedBooking.startTime}`;
        const selectedEnd = `${selectedBooking.endDate} ${selectedBooking.endTime}`;
        const existingStart = `${occurence.startDate} ${occurence.startTime}`;
        const existingEnd = `${occurence.endDate} ${occurence.endTime}`;
        return (
          moment(selectedStart, dateTimeFormat).isBetween(
            existingStart,
            existingEnd
          ) ||
          moment(selectedEnd, dateTimeFormat).isBetween(
            existingStart,
            existingEnd
          )
        );
      }
    );

    return {
      ...selectedBooking,
      conflict: bookingWithConflict || null,
    }
  });
}

function isResourceOccupied(occurence, start, end) {
  const dateTimeFormat = 'M/DD/YYYY hh:mm';
  moment(occurence.dateTime, dateTimeFormat).isBetween(start, end);
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
  parseComboResourcesWithAllData,
  getAllBookingsWithSelectedResource,
  checkAndSetBookingsWithConflict,
  formatDate,
};
