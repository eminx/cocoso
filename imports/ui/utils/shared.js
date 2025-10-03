import { Meteor } from 'meteor/meteor';
import Resizer from 'react-image-file-resizer';
import { Slingshot } from 'meteor/edgee:slingshot';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

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
  const newStr = str?.replace(/\s+/g, '');
  return newStr;
}

function compareForSort(a, b) {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateA - dateB;
}

const compareDatesWithStartDateForSort = (a, b) => {
  const dateA = dayjs(a.startDate, 'YYYY-MM-DD');
  const dateB = dayjs(b.startDate, 'YYYY-MM-DD');
  return dateA.diff(dateB);
};

function parseTitle(title) {
  return title?.replace(/\s+/g, '-').toLowerCase();
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

const call = async (method, ...parameters) =>
  Meteor.callAsync(method, ...parameters);

const resizeImage = (
  image,
  desiredMaximumImageWidth = 1200,
  desiredMaximumImageHeight = 1200
) => {
  if (!image) {
    return;
  }

  if (image.size < 400000) {
    // no need to shrink size if already less than 400kb
    return image;
  }

  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      image,
      desiredMaximumImageWidth,
      desiredMaximumImageHeight,
      'JPEG|PNG',
      85,
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
};

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
    const resourceSelected = resources.find(
      (res) => res?._id === activity?.resourceId
    );
    if (!resourceSelected) {
      activity.datesAndTimes.forEach((recurrence) => {
        allBookings.push({
          ...helper_parseAllBookingsWithResources(activity, recurrence),
          isNoResource: true,
        });
      });
      return;
    }
    activity.datesAndTimes.forEach((recurrence) => {
      if (resourceSelected.isCombo) {
        resourceSelected.resourcesForCombo.forEach((resourceForCombo) => {
          if (!resourceForCombo) {
            return;
          }
          const resourceForComboReal = resources.find(
            (r) => r._id === resourceForCombo._id
          );
          if (!resourceForComboReal?.isBookable) {
            return;
          }
          allBookings.push({
            ...helper_parseAllBookingsWithResources(activity, recurrence),
            isWithComboResource: true,
            resource: resourceForCombo.label,
            resourceId: resourceForCombo._id,
            comboResource: activity.resource,
            comboResourceId: resourceSelected._id,
          });
        });
      } else {
        if (!resourceSelected.isBookable) {
          return;
        }
        allBookings.push({
          ...helper_parseAllBookingsWithResources(activity, recurrence),
          isWithComboResource: false,
          resource: resourceSelected.label,
          resourceId: resourceSelected._id,
        });
      }
    });
  });

  return allBookings;
}

function helper_parseAllBookingsWithResources(activity, recurrence) {
  if (!recurrence) {
    return;
  }
  const { startDate, startTime, endDate, endTime, isMultipleDay } = recurrence;

  return {
    activityId: activity._id,
    title: activity.title,
    start: dayjs(startDate + startTime, 'YYYY-MM-DDHH:mm').toDate(),
    end: dayjs(endDate + endTime, 'YYYY-MM-DDHH:mm').toDate(),
    startDate,
    startTime,
    endDate,
    endTime,
    authorName: activity.authorName,
    longDescription: activity.longDescription,
    isMultipleDay: isMultipleDay || startDate !== endDate,
    isExclusiveActivity: activity.isExclusiveActivity,
    isPublicActivity: activity.isPublicActivity,
    isGroupMeeting: activity.isGroupMeeting,
    groupId: activity.groupId,
    isGroupPrivate: activity.isGroupPrivate,
    images: activity.images,
    host: activity.host,
  };
}

function getAllBookingsWithSelectedResource(selectedResource, allBookings) {
  return allBookings.filter((booking) => {
    if (!selectedResource) {
      return true;
    }
    if (selectedResource.isCombo) {
      return selectedResource.resourcesForCombo.some(
        (resourceForCombo) => resourceForCombo._id === booking.resourceId
      );
    }
    return booking.resourceId === selectedResource._id;
  });
}

function isDatesInConflict(
  existingStart,
  existingEnd,
  selectedStart,
  selectedEnd
) {
  const dateTimeFormat = 'YYYY-MM-DD HH:mm';

  // If the same values are selected, dayjs compare returns false. That's why we do:
  if (existingStart === selectedStart && existingEnd === selectedEnd) {
    return true;
  }

  return (
    dayjs(selectedStart, dateTimeFormat).isBetween(
      existingStart,
      existingEnd
    ) ||
    dayjs(selectedEnd, dateTimeFormat).isBetween(existingStart, existingEnd) ||
    dayjs(existingStart, dateTimeFormat).isBetween(
      selectedStart,
      selectedEnd
    ) ||
    dayjs(existingEnd, dateTimeFormat).isBetween(selectedStart, selectedEnd)
  );
}

function checkAndSetBookingsWithConflict(
  selectedBookings,
  allBookingsWithSelectedResource,
  selfBookingIdForEdit
) {
  return selectedBookings.map((selectedBooking) => {
    const bookingWithConflict = allBookingsWithSelectedResource
      .filter(
        (item) =>
          !selfBookingIdForEdit || item.activityId !== selfBookingIdForEdit
      )
      .find((occurence) => {
        const selectedStart = `${selectedBooking.startDate} ${selectedBooking.startTime}`;
        const selectedEnd = `${selectedBooking.endDate} ${selectedBooking.endTime}`;
        const existingStart = `${occurence.startDate} ${occurence.startTime}`;
        const existingEnd = `${occurence.endDate} ${occurence.endTime}`;
        return isDatesInConflict(
          existingStart,
          existingEnd,
          selectedStart,
          selectedEnd
        );
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
  const formattedDate = `${appendLeadingZeroes(
    date.getFullYear()
  )}-${appendLeadingZeroes(date.getMonth() + 1)}-${appendLeadingZeroes(
    date.getDate()
  )}`;
  return formattedDate;
}

function getHslValuesFromLength(length) {
  if (typeof length !== 'number') {
    return null;
  }

  const saturation = '90%';
  const lightness = '35%';

  const colorValues = [];
  const share = Math.round(360 / length);
  for (let i = 0; i < length; i += 1) {
    colorValues.push(
      `hsl(${share * (i + 1) - share / 2}, ${saturation}, ${lightness})`
    );
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

function getComboResourcesWithColor(
  comboResources,
  nonComboResourcesWithColor
) {
  return comboResources.sort(localeSort).map((res) => {
    const colors = [];
    res.resourcesForCombo.forEach((resCo) => {
      const resWithColor = nonComboResourcesWithColor.find(
        (nRes) => resCo._id === nRes._id
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
    return { ...res, color, label: res.label };
  });
}

function getFullName(user) {
  const { firstName, lastName } = user;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || '---';
}

function parseHtmlEntities(input) {
  return input.replace(/\\+u([0-9a-fA-F]{4})/g, (a, b) =>
    String.fromCharCode(parseInt(b, 16))
  );
}

function compareMeetingDatesForSort(a, b) {
  const dateA = new Date(a.startDate);
  const dateB = new Date(b.startDate);
  return dateA - dateB;
}

function parseGroupsWithMeetings(groups, meetings) {
  const allGroups = groups.map((group) => {
    const groupId = group._id;
    const allGroupActivities = meetings.filter(
      (meeting) => meeting.groupId === groupId
    );
    const groupActivitiesFuture = allGroupActivities
      .map((a) => a.datesAndTimes[0])
      .sort(compareMeetingDatesForSort);
    return {
      ...group,
      datesAndTimes: groupActivitiesFuture,
    };
  });

  const groupsWithFutureMeetings = [];
  const groupsWithoutFutureMeetings = [];
  allGroups.forEach((group) => {
    const groupMeetings = group.datesAndTimes;
    if (groupMeetings && groupMeetings.length > 0) {
      groupsWithFutureMeetings.push(group);
    } else {
      groupsWithoutFutureMeetings.push(group);
    }
  });
  return [
    ...groupsWithFutureMeetings.sort(compareForSortFutureMeeting),
    ...groupsWithoutFutureMeetings.sort(compareForSort).reverse(),
  ];
}

const compareForSortFutureMeeting = (a, b) => {
  const firstOccurenceA = a.datesAndTimes && a.datesAndTimes[0];
  const firstOccurenceB = b.datesAndTimes && b.datesAndTimes[0];
  if (!firstOccurenceA || !firstOccurenceB) {
    return -1;
  }
  const dateA = new Date(
    firstOccurenceA &&
      firstOccurenceA.startDate + 'T' + firstOccurenceA.startTime + ':00Z'
  );
  const dateB = new Date(
    firstOccurenceB &&
      firstOccurenceB.startDate + 'T' + firstOccurenceB.startTime + ':00Z'
  );
  return dateA - dateB;
};

const getCategoriesAssignedToWorks = (works) => {
  const labels = Array.from(
    new Set(works.map((work) => work.category && work.category.label))
  );
  const hslValues = getHslValuesFromLength(labels.length);
  return labels
    .filter((label) => label !== '' && label !== undefined)
    .map((label, i) => ({
      label,
      color: hslValues[i],
    }))
    .sort((a, b) => a.label?.localeCompare(b.label));
};

const stripHtml = (html) => {
  return html.replace(/<[^>]*>?/gm, '');
};

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export {
  localeSort,
  getInitials,
  removeSpace,
  compareForSort,
  compareMeetingDatesForSort,
  compareDatesWithStartDateForSort,
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
  parseHtmlEntities,
  parseGroupsWithMeetings,
  getCategoriesAssignedToWorks,
  stripHtml,
  debounce,
};
