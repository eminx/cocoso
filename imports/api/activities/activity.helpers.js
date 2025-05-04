import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const now = dayjs();

function createDateTime(dateStr, timeStr) {
  return dayjs(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm');
}

const getFirstFutureOccurence = (occurrence) =>
  createDateTime(occurrence.endDate, occurrence.endTime)?.isAfter(now);

const getLastPastOccurence = (occurrence) =>
  createDateTime(occurrence.startDate, occurrence.startTime)?.isBefore(now);

export function compareDatesForSortActivities(a, b) {
  const firstOccurenceA = a?.datesAndTimes?.find(getFirstFutureOccurence);
  const firstOccurenceB = b?.datesAndTimes?.find(getFirstFutureOccurence);
  const dateA = new Date(`${firstOccurenceA?.startDate}T${firstOccurenceA?.startTime}:00Z`);
  const dateB = new Date(`${firstOccurenceB?.startDate}T${firstOccurenceB?.startTime}:00Z`);
  return dateA - dateB;
}

export function compareDatesForSortActivitiesReverse(a, b) {
  const firstOccurenceA = a.datesAndTimes.find(getLastPastOccurence);
  const firstOccurenceB = b.datesAndTimes.find(getLastPastOccurence);
  const dateA = new Date(`${firstOccurenceA?.startDate}T${firstOccurenceA?.startTime}:00Z`);
  const dateB = new Date(`${firstOccurenceB?.startDate}T${firstOccurenceB?.startTime}:00Z`);
  return dateB - dateA;
}
