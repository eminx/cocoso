import { Meteor } from 'meteor/meteor';
import dayjs from 'dayjs';

import { getHost } from '../_utils/shared';
import { filterPrivateGroups } from '../activities/activity.helpers';
import Activities from '../activities/activity';
import Occurrences from './occurrence';
import { MAX_OCCURRENCE_DURATION_DAYS } from './occurrence.helpers';

Meteor.methods({
  // The date-range query the calendar (and anything else that used to fetch
  // every activity) should use instead. Returns one pseudo-activity per
  // occurrence — same shape parseAllBookingsWithResources already expects
  // from an activity with a single-entry datesAndTimes array — so existing
  // calendar rendering code doesn't need to change, only the loader that
  // feeds it.
  async getOccurrencesInRange(
    rangeStart,
    rangeEnd,
    isPortalHost = false,
    hostPredefined
  ) {
    const host = hostPredefined || getHost(this);
    const user = await Meteor.userAsync();

    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    const windowFloor = dayjs(start)
      .subtract(MAX_OCCURRENCE_DURATION_DAYS, 'day')
      .toDate();

    const query = {
      startDateTime: { $gte: windowFloor, $lte: end },
      endDateTime: { $gte: start },
    };
    if (!isPortalHost) {
      query.host = host;
    }

    try {
      const occurrences = await Occurrences.find(query).fetchAsync();
      const activityIds = [...new Set(occurrences.map((o) => o.activityId))];
      const activities = await Activities.find({
        _id: { $in: activityIds },
      }).fetchAsync();
      const activitiesById = new Map(activities.map((a) => [a._id, a]));

      const rows = occurrences
        .map((occ) => {
          const activity = activitiesById.get(occ.activityId);
          if (!activity) {
            // Orphaned occurrence (its activity was deleted without cascading,
            // or is mid-deletion) — skip rather than surface a broken row.
            return null;
          }
          return {
            _id: activity._id,
            title: activity.title,
            authorName: activity.authorName,
            longDescription: activity.longDescription,
            resource: activity.resource,
            resourceId: activity.resourceId,
            isPublicActivity: activity.isPublicActivity,
            isGroupMeeting: activity.isGroupMeeting,
            groupId: activity.groupId,
            isGroupPrivate: activity.isGroupPrivate,
            host: activity.host,
            datesAndTimes: [
              {
                startDate: occ.startDate,
                startTime: occ.startTime,
                endDate: occ.endDate,
                endTime: occ.endTime,
              },
            ],
          };
        })
        .filter(Boolean);

      return await filterPrivateGroups(rows, user);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },
});
