import Occurrences from './occurrence';
import Registrations from '../registrations/registration';

// No occurrence in this app spans longer than this. Used purely as a
// performance bound (a lower bound on startDateTime) so range queries never
// degrade into scanning a host's entire history — see
// imports/api/occurrences/occurrence.js for the indexing rationale.
const MAX_OCCURRENCE_DURATION_DAYS = 90;

// Occurrences store startDate/startTime/endDate/endTime as plain strings
// (no timezone in the data model). We compute a real Date deterministically
// as UTC so range queries don't depend on the server process's local TZ.
// This only affects range-bucketing/sorting, not what's displayed to users
// (the string fields remain the source of truth for that).
function toDateTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00Z`);
}

function buildOccurrenceFields({ startDate, startTime, endDate, endTime }) {
  return {
    startDate,
    startTime,
    endDate,
    endTime,
    startDateTime: toDateTime(startDate, startTime),
    endDateTime: toDateTime(endDate, endTime),
  };
}

async function insertOccurrence(host, activityId, occurrence) {
  return Occurrences.insertAsync({
    host,
    activityId,
    ...buildOccurrenceFields(occurrence),
    creationDate: new Date(),
  });
}

// Reconciles the occurrences an activity should have (as edited in the
// form) against what's actually stored, by _id rather than array position.
// - entries with an existing _id are updated in place (registrations untouched)
// - entries without an _id are inserted as new occurrences
// - stored occurrences not present in the incoming list are removed, along
//   with their registrations
async function reconcileOccurrences(host, activityId, incomingDatesAndTimes) {
  const existing = await Occurrences.find({ activityId }).fetchAsync();
  const existingById = new Map(existing.map((occ) => [occ._id, occ]));
  const keptIds = new Set();

  for (const entry of incomingDatesAndTimes || []) {
    if (entry._id && existingById.has(entry._id)) {
      keptIds.add(entry._id);
      await Occurrences.updateAsync(entry._id, {
        $set: buildOccurrenceFields(entry),
      });
    } else {
      const newId = await insertOccurrence(host, activityId, entry);
      keptIds.add(newId);
    }
  }

  const removedIds = existing
    .map((occ) => occ._id)
    .filter((id) => !keptIds.has(id));

  if (removedIds.length > 0) {
    await Occurrences.removeAsync({ _id: { $in: removedIds } });
    await Registrations.removeAsync({ occurrenceId: { $in: removedIds } });
  }
}

async function removeOccurrencesForActivity(activityId) {
  const occurrences = await Occurrences.find(
    { activityId },
    { fields: { _id: 1 } }
  ).fetchAsync();
  const occurrenceIds = occurrences.map((occ) => occ._id);

  await Occurrences.removeAsync({ activityId });
  if (occurrenceIds.length > 0) {
    await Registrations.removeAsync({ occurrenceId: { $in: occurrenceIds } });
  }
}

// Reassembles the datesAndTimes[].attendees[] shape the frontend already
// expects, from the Occurrences/Registrations collections. Keeps every
// existing UI component working unchanged for Phase 1 — occurrenceIndex
// still means "position in this sorted array" the same way it always did,
// consistently within a single response.
async function hydrateActivities(activities) {
  if (!activities || activities.length === 0) {
    return activities;
  }

  const activityIds = activities.map((act) => act._id);
  const occurrences = await Occurrences.find({
    activityId: { $in: activityIds },
  })
    .fetchAsync();

  const occurrenceIds = occurrences.map((occ) => occ._id);
  const registrations = occurrenceIds.length
    ? await Registrations.find({
        occurrenceId: { $in: occurrenceIds },
      })
        .fetchAsync()
    : [];

  const registrationsByOccurrence = new Map();
  registrations
    .sort((a, b) => a.registerDate - b.registerDate)
    .forEach((reg) => {
      const list = registrationsByOccurrence.get(reg.occurrenceId) || [];
      list.push({
        _id: reg._id,
        email: reg.email,
        username: reg.username,
        firstName: reg.firstName,
        lastName: reg.lastName,
        numberOfPeople: reg.numberOfPeople,
        registerDate: reg.registerDate,
      });
      registrationsByOccurrence.set(reg.occurrenceId, list);
    });

  const occurrencesByActivity = new Map();
  occurrences
    .sort((a, b) => a.startDateTime - b.startDateTime)
    .forEach((occ) => {
      const list = occurrencesByActivity.get(occ.activityId) || [];
      list.push({
        _id: occ._id,
        startDate: occ.startDate,
        startTime: occ.startTime,
        endDate: occ.endDate,
        endTime: occ.endTime,
        attendees: registrationsByOccurrence.get(occ._id) || [],
      });
      occurrencesByActivity.set(occ.activityId, list);
    });

  return activities.map((act) => ({
    ...act,
    datesAndTimes: occurrencesByActivity.get(act._id) || [],
  }));
}

async function hydrateActivity(activity) {
  if (!activity) {
    return activity;
  }
  const [hydrated] = await hydrateActivities([activity]);
  return hydrated;
}

export {
  MAX_OCCURRENCE_DURATION_DAYS,
  toDateTime,
  buildOccurrenceFields,
  insertOccurrence,
  reconcileOccurrences,
  removeOccurrencesForActivity,
  hydrateActivities,
  hydrateActivity,
};
