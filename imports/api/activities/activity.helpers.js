import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import Groups from '../groups/group';

dayjs.extend(isBetween);

const now = dayjs();

// Hides activities tied to a private group from anyone who isn't a member
// (or invitee, or the group's admin). Shared by activity.methods.js and
// occurrence.methods.js — anywhere a list of activity-like objects
// (carrying isGroupPrivate/groupId) is about to be returned to a client.
export async function filterPrivateGroups(activities, user) {
  if (!activities) {
    return [];
  }
  const filterResults = await Promise.all(
    activities.map(async (act) => {
      if (!act.isGroupPrivate) {
        return true;
      }
      if (!user) {
        return false;
      }
      const group = await Groups.findOneAsync({ _id: act.groupId });
      const userId = user?._id;
      return (
        group.adminId === userId ||
        group.members.some((member) => member.memberId === userId) ||
        group.peopleInvited.some(
          (person) => person.email === user.emails[0].address
        )
      );
    })
  );
  return activities.filter((_, index) => filterResults[index]);
}

function createDateTime(dateStr, timeStr) {
  return dayjs(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm');
}

const getFirstFutureOccurence = (occurrence) =>
  createDateTime(occurrence.endDate, occurrence.endTime)?.isAfter(now);

const getLastPastOccurence = (occurrence) =>
  createDateTime(occurrence.startDate, occurrence.startTime)?.isBefore(now);

export function parseGroupActivities(activities) {
  const activitiesParsed = [];
  activities?.forEach((act) => {
    if (!act.isGroupMeeting) {
      activitiesParsed.push(act);
    } else {
      const indexParsed = activitiesParsed.findIndex((actP) => {
        return actP.groupId === act.groupId;
      });
      if (indexParsed === -1) {
        activitiesParsed.push(act);
      } else {
        activitiesParsed[indexParsed].datesAndTimes.push({
          ...act.datesAndTimes[0],
          resourceId: act.resourceId,
          resource: act.resource,
        });
      }
    }
  });
  return activitiesParsed.map((act) => ({
    ...act,
    datesAndTimes: act.datesAndTimes.sort((a, b) => dayjs(a?.startDate) - dayjs(b?.startDate)),
  }));
}

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
