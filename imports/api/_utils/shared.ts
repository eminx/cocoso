import { Meteor } from 'meteor/meteor';
import Resizer from 'react-image-file-resizer';
import { Slingshot } from 'meteor/edgee:slingshot';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

interface LabeledItem {
  label: string;
}

interface DatedItem {
  creationDate: Date | string;
}

interface StartDateItem {
  startDate: string;
}

interface DateTimeOccurrence {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isMultipleDay?: boolean;
}

interface Activity {
  _id: string;
  title: string;
  datesAndTimes?: DateTimeOccurrence[];
  resourceId?: string;
  resource?: string;
  authorName?: string;
  longDescription?: string;
  isExclusiveActivity?: boolean;
  isPublicActivity?: boolean;
  isGroupMeeting?: boolean;
  groupId?: string;
  isGroupPrivate?: boolean;
  images?: string[];
  host?: string;
}

interface ResourceForCombo {
  _id: string;
  label: string;
}

interface Resource {
  _id: string;
  label: string;
  isCombo?: boolean;
  isBookable?: boolean;
  resourcesForCombo?: ResourceForCombo[];
  color?: string;
}

interface Booking {
  activityId: string;
  title: string;
  start: Date;
  end: Date;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  authorName?: string;
  longDescription?: string;
  isMultipleDay: boolean;
  isExclusiveActivity?: boolean;
  isPublicActivity?: boolean;
  isGroupMeeting?: boolean;
  groupId?: string;
  isGroupPrivate?: boolean;
  images?: string[];
  host?: string;
  isNoResource?: boolean;
  isWithComboResource?: boolean;
  resource?: string;
  resourceId?: string;
  comboResource?: string;
  comboResourceId?: string;
  conflict?: Booking | null;
}

interface SelectedBooking {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

interface Group {
  _id: string;
  creationDate: Date | string;
  datesAndTimes?: DateTimeOccurrence[];
}

interface CategoryLabel {
  label: string;
  color: string;
}

interface Work {
  category?: {
    label?: string;
  };
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
}

interface MeteorConnection {
  httpHeaders?: {
    host?: string;
  };
}

interface MeteorContext {
  connection?: MeteorConnection;
}

function localeSort(a: LabeledItem, b: LabeledItem): number {
  return a.label.localeCompare(b.label);
}

function getInitials(string: string): string {
  const names = string.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}

function removeSpace(str: string | undefined): string | undefined {
  const newStr = str?.replace(/\s+/g, '');
  return newStr;
}

function compareForSort(a: DatedItem, b: DatedItem): number {
  const dateA = new Date(a.creationDate);
  const dateB = new Date(b.creationDate);
  return dateA.getTime() - dateB.getTime();
}

const compareDatesWithStartDateForSort = (a: StartDateItem, b: StartDateItem): number => {
  const dateA = dayjs(a.startDate, 'YYYY-MM-DD');
  const dateB = dayjs(b.startDate, 'YYYY-MM-DD');
  return dateA.diff(dateB);
};

function parseTitle(title: string | undefined): string | undefined {
  return title?.replace(/\s+/g, '-').toLowerCase();
}

function emailIsValid(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

function includesSpecialCharacters(string: string): boolean {
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (format.test(string)) {
    return true;
  }
  return false;
}

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const call = async <T>(method: string, ...parameters: unknown[]): Promise<T> =>
  Meteor.callAsync(method, ...parameters) as Promise<T>;

const resizeImage = (
  image: File | undefined,
  desiredMaximumImageWidth = 1200,
  desiredMaximumImageHeight = 1200
): Promise<File> | File | undefined => {
  if (!image) {
    return;
  }

  if (image.size < 400000) {
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
        const uploadableImage = dataURLtoFile(uri as string, image.name);
        resolve(uploadableImage);
      },
      'base64'
    );
  });
};

const slingshotUpload = (directory: string) => new Slingshot.Upload(directory);

const uploadImage = (image: File, directory: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const upload = slingshotUpload(directory);
    upload.send(image, (error: Error | null, downloadUrl: string) => {
      if (error) {
        reject(error);
      }
      resolve(downloadUrl);
    });
  });

function helper_parseAllBookingsWithResources(
  activity: Activity,
  recurrence: DateTimeOccurrence | undefined
): Omit<Booking, 'conflict'> | undefined {
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

function parseAllBookingsWithResources(
  activities: Activity[] | undefined,
  resources: Resource[] | undefined
): Booking[] | undefined {
  if (!activities || !resources) {
    return;
  }
  const allBookings: Booking[] = [];

  activities.forEach((activity) => {
    if (!activity.datesAndTimes) {
      return;
    }
    const resourceSelected = resources.find(
      (res) => res?._id === activity?.resourceId
    );
    if (!resourceSelected) {
      activity.datesAndTimes.forEach((recurrence) => {
        const parsed = helper_parseAllBookingsWithResources(activity, recurrence);
        if (parsed) {
          allBookings.push({
            ...parsed,
            isNoResource: true,
            conflict: null,
          });
        }
      });
      return;
    }
    activity.datesAndTimes.forEach((recurrence) => {
      if (resourceSelected.isCombo) {
        resourceSelected.resourcesForCombo?.forEach((resourceForCombo) => {
          if (!resourceForCombo) {
            return;
          }
          const resourceForComboReal = resources.find(
            (r) => r._id === resourceForCombo._id
          );
          if (!resourceForComboReal?.isBookable) {
            return;
          }
          const parsed = helper_parseAllBookingsWithResources(activity, recurrence);
          if (parsed) {
            allBookings.push({
              ...parsed,
              isWithComboResource: true,
              resource: resourceForCombo.label,
              resourceId: resourceForCombo._id,
              comboResource: activity.resource,
              comboResourceId: resourceSelected._id,
              conflict: null,
            });
          }
        });
      } else {
        if (!resourceSelected.isBookable) {
          return;
        }
        const parsed = helper_parseAllBookingsWithResources(activity, recurrence);
        if (parsed) {
          allBookings.push({
            ...parsed,
            isWithComboResource: false,
            resource: resourceSelected.label,
            resourceId: resourceSelected._id,
            conflict: null,
          });
        }
      }
    });
  });

  return allBookings;
}

function getAllBookingsWithSelectedResource(
  selectedResource: Resource | undefined,
  allBookings: Booking[]
): Booking[] {
  return allBookings.filter((booking) => {
    if (!selectedResource) {
      return true;
    }
    if (selectedResource.isCombo) {
      return selectedResource.resourcesForCombo?.some(
        (resourceForCombo) => resourceForCombo._id === booking.resourceId
      );
    }
    return booking.resourceId === selectedResource._id;
  });
}

function isDatesInConflict(
  existingStart: string,
  existingEnd: string,
  selectedStart: string,
  selectedEnd: string
): boolean {
  const dateTimeFormat = 'YYYY-MM-DD HH:mm';

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
  selectedBookings: SelectedBooking[],
  allBookingsWithSelectedResource: Booking[],
  selfBookingIdForEdit?: string
): (SelectedBooking & { conflict: Booking | null })[] {
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

function appendLeadingZeroes(n: number): string {
  if (n <= 9) {
    return `0${n}`;
  }
  return String(n);
}

function formatDate(date: Date): string {
  const formattedDate = `${appendLeadingZeroes(
    date.getFullYear()
  )}-${appendLeadingZeroes(date.getMonth() + 1)}-${appendLeadingZeroes(
    date.getDate()
  )}`;
  return formattedDate;
}

function getHslValuesFromLength(length: number): string[] | null {
  if (typeof length !== 'number') {
    return null;
  }

  const saturation = '90%';
  const lightness = '35%';

  const colorValues: string[] = [];
  const share = Math.round(360 / length);
  for (let i = 0; i < length; i += 1) {
    colorValues.push(
      `hsl(${share * (i + 1) - share / 2}, ${saturation}, ${lightness})`
    );
  }

  return colorValues;
}

function getNonComboResourcesWithColor(
  nonComboResources: Resource[] | undefined
): (Resource & { color: string })[] | undefined {
  if (!nonComboResources) {
    return;
  }
  const hslValues = getHslValuesFromLength(nonComboResources.length);
  if (!hslValues) return;
  return nonComboResources.sort(localeSort).map((res, i) => {
    return {
      ...res,
      color: hslValues[i],
    };
  });
}

function getComboResourcesWithColor(
  comboResources: Resource[],
  nonComboResourcesWithColor: (Resource & { color: string })[]
): (Resource & { color: string })[] {
  return comboResources.sort(localeSort).map((res) => {
    const colors: string[] = [];
    res.resourcesForCombo?.forEach((resCo) => {
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

function getFullName(user: UserProfile): string {
  const { firstName, lastName } = user;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || '---';
}

function parseHtmlEntities(input: string): string {
  return input.replace(/\\+u([0-9a-fA-F]{4})/g, (a, b) =>
    String.fromCharCode(parseInt(b, 16))
  );
}

function compareMeetingDatesForSort(a: StartDateItem, b: StartDateItem): number {
  const dateA = new Date(a.startDate);
  const dateB = new Date(b.startDate);
  return dateA.getTime() - dateB.getTime();
}

const compareForSortFutureMeeting = (a: Group, b: Group): number => {
  const firstOccurenceA = a.datesAndTimes && a.datesAndTimes[0];
  const firstOccurenceB = b.datesAndTimes && b.datesAndTimes[0];
  if (!firstOccurenceA || !firstOccurenceB) {
    return -1;
  }
  const dateA = new Date(
    firstOccurenceA.startDate + 'T' + firstOccurenceA.startTime + ':00Z'
  );
  const dateB = new Date(
    firstOccurenceB.startDate + 'T' + firstOccurenceB.startTime + ':00Z'
  );
  return dateA.getTime() - dateB.getTime();
};

interface Meeting {
  groupId: string;
  datesAndTimes: DateTimeOccurrence[];
}

function parseGroupsWithMeetings(groups: Group[], meetings: Meeting[]): Group[] {
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

  const groupsWithFutureMeetings: Group[] = [];
  const groupsWithoutFutureMeetings: Group[] = [];
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

const getCategoriesAssignedToWorks = (works: Work[] | undefined): CategoryLabel[] => {
  const labels = Array.from(
    new Set(works?.map((work) => work.category && work.category.label))
  );
  const hslValues = getHslValuesFromLength(labels.length);
  if (!hslValues) return [];
  return labels
    .filter((label): label is string => label !== '' && label !== undefined)
    .map((label, i) => ({
      label,
      color: hslValues[i],
    }))
    .sort((a, b) => a.label?.localeCompare(b.label));
};

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, '');
};

function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  timeout = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

const getHost = (self: MeteorContext | undefined): string | undefined =>
  self?.connection?.httpHeaders?.host;

const siteUrl = Meteor.absoluteUrl();

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
  getHost,
  siteUrl,
};

export type {
  Activity,
  Resource,
  Booking,
  DateTimeOccurrence,
  Group,
  CategoryLabel,
};
