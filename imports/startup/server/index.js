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
          // A malformed legacy record shouldn't be able to crash server
          // boot. It's not lost — the original stays intact under
          // _datesAndTimesLegacy after the rename below — just skipped here
          // so it can be looked at and fixed by hand.
          console.warn(
            `migrateActivitiesToOccurrences: skipping malformed occurrence on activity ${activity._id}`,
            occurrence
          );
          continue;
        }

        const occurrenceId = await Occurrences.insertAsync({
          host: activity.host,
          activityId: activity._id,
          ...buildOccurrenceFields(occurrence),
          creationDate: activity.creationDate || new Date(),
        });

        for (const attendee of occurrence.attendees || []) {
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
        }
      }

      // Not Activities.updateAsync: collection2 filters a modifier's keys
      // against the CURRENT schema before validating, and datesAndTimes was
      // deliberately removed from it — so a $rename keyed on that field gets
      // stripped as "not in the schema," leaving an empty modifier (this is
      // not hypothetical, it's the exact error collection2 throws if you
      // try). Renaming a field away from a name the schema no longer
      // recognizes is one of the few things the validated path genuinely
      // cannot do — same category as index creation, not a shortcut around
      // validation for its own sake.
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
