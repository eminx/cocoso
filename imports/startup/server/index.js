import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { onPageLoad } from 'meteor/server-render';
import React from 'react';

import Hosts from '/imports/api/hosts/host';
import Memberships from '/imports/api/memberships/membership';
import Activities from '/imports/api/activities/activity';
import Occurrences from '/imports/api/occurrences/occurrence';
import Registrations from '/imports/api/registrations/registration';
import { buildOccurrenceFields } from '/imports/api/occurrences/occurrence.helpers';
import { call } from '/imports/api/_utils/shared';

import serverRenderer from './serverRenderer';
import './api';
import './migrations';
import './oauth';

const { cdn_server } = Meteor.settings;

function setupSMTP() {
  const smtp = Meteor.settings?.mailCredentials?.smtp;

  if (!smtp) {
    console.warn(
      'SMTP settings not found in Meteor.settings.mailCredentials.smtp'
    );
    return;
  }

  process.env.MAIL_URL = `smtps://${encodeURIComponent(smtp.userName)}:${
    smtp.password
  }@${smtp.host}:${smtp.port}`;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    const newUrl = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${newUrl}`;
  };
}

// One-off: splits Activities.datesAndTimes[].attendees[] out into the
// Occurrences/Registrations collections, then renames the embedded field
// (not deletes it) to _datesAndTimesLegacy — kept as a frozen audit/rollback
// copy so a bug in this transform isn't unrecoverable, but named so nothing
// going forward can mistake it for live data. Drop it for good in a later
// cleanup once the new collections have run clean for a while.
// Run once during a deploy window (back up the activities collection first)
// by uncommenting the call below, then re-comment it afterward — running it
// twice would duplicate every occurrence/registration, since there's no
// "already migrated" guard.
function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

async function migrateActivitiesToOccurrences() {
  await Activities.find({ datesAndTimes: { $exists: true } }).forEachAsync(
    async (activity) => {
      for (const occurrence of activity.datesAndTimes || []) {
        if (
          !occurrence?.startDate ||
          !occurrence?.startTime ||
          !occurrence?.endDate ||
          !occurrence?.endTime
        ) {
          console.warn(
            `migrateActivitiesToOccurrences: skipping malformed occurrence on activity ${activity._id}`,
            occurrence
          );
          continue;
        }

        const fields = buildOccurrenceFields(occurrence);

        // The presence check above isn't enough — the composed Dates can still
        // be Invalid Date (bad strings, Date+string concatenation, etc.).
        if (
          !isValidDate(fields.startDateTime) ||
          !isValidDate(fields.endDateTime)
        ) {
          console.warn(
            `migrateActivitiesToOccurrences: invalid composed date on activity ${activity._id}`,
            {
              occurrence,
              startDateTime: fields.startDateTime,
              endDateTime: fields.endDateTime,
            }
          );
          continue;
        }

        // Idempotency: don't re-insert if a crash mid-activity left us retrying.
        const already = await Occurrences.findOneAsync({
          activityId: activity._id,
          startDateTime: fields.startDateTime,
          endDateTime: fields.endDateTime,
        });
        if (already) {
          continue;
        }

        let occurrenceId;
        try {
          occurrenceId = await Occurrences.insertAsync({
            host: activity.host,
            activityId: activity._id,
            ...fields,
            creationDate: activity.creationDate || new Date(),
          });
        } catch (err) {
          // Any other validation failure (bad host, unexpected field, etc.)
          // must not abort the activity — otherwise the rename below never
          // runs and we boot-loop on the same document forever.
          console.warn(
            `migrateActivitiesToOccurrences: failed to insert occurrence on activity ${activity._id}`,
            err?.details || err?.message || err,
            occurrence
          );
          continue;
        }

        for (const attendee of occurrence.attendees || []) {
          try {
            await Registrations.insertAsync({
              host: activity.host,
              occurrenceId,
              activityId: activity._id,
              email: attendee.email,
              username: attendee.username,
              firstName: attendee.firstName,
              lastName: attendee.lastName,
              numberOfPeople: attendee.numberOfPeople,
              registerDate: attendee.registerDate || new Date(),
            });
          } catch (err) {
            console.warn(
              `migrateActivitiesToOccurrences: failed to insert registration for occurrence ${occurrenceId}`,
              err?.details || err?.message || err,
              attendee
            );
          }
        }
      }

      await Activities.rawCollection().updateOne(
        { _id: activity._id },
        { $rename: { datesAndTimes: '_datesAndTimesLegacy' } }
      );
    }
  );
}

Meteor.startup(async () => {
  setupSMTP();

  await migrateActivitiesToOccurrences();

  if (cdn_server) {
    WebAppInternals.setBundledJsCssPrefix(cdn_server);
  }

  onPageLoad(async (sink) => {
    try {
      await serverRenderer(sink);
    } catch (error) {
      console.error('SSR Error:', error);
      sink.renderIntoElementById('root', '<div>Server rendering failed</div>');
    }
  });
});
