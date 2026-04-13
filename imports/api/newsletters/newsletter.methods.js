import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Hosts from '/imports/api/hosts/host';

import Newsletters from './newsletter';
import { getHost } from '../_utils/shared';
import { isAdmin } from '../users/user.roles';

Meteor.methods({
  async getNewsletters(hostPredefined) {
    const host = hostPredefined || getHost(this);
    return await Newsletters.find(
      { host },
      {
        fields: {
          _id: 1,
          authorUsername: 1,
          creationDate: 1,
          host: 1,
          imageUrl: 1,
          subject: 1,
        },
        sort: { creationDate: -1 },
      }
    ).fetchAsync();
  },
  async getNewsletterById(newsletterId, hostPredefined) {
    const host = hostPredefined || getHost(this);
    return await Newsletters.findOneAsync({
      _id: newsletterId,
      host,
    });
  },

  async sendNewsletter(email, emailHtml) {
    check(email, Object);
    check(emailHtml, String);

    if (!email?.subject) {
      throw new Meteor.Error('Email subject is required');
    }

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const currentUser = await Meteor.userAsync();

    if (!currentUser || !isAdmin(currentUser, currentHost)) {
      throw new Meteor.Error('You are not allowed!');
    }

    const isPortalHost = currentHost.isPortalHost;

    try {
      const newEmailId = await Newsletters.insertAsync({
        ...email,
        authorId: currentUser._id,
        authorUsername: currentUser.username,
        creationDate: new Date(),
        host,
        hostId: currentHost._id.toString(),
      });

      const emailHtmlWithBrowserLink = emailHtml.replace(
        '[newsletter-id]',
        newEmailId
      );

      // Safer member fetching with limits
      const members = isPortalHost
        ? await Meteor.users
            .find(
              { 'emails.0': { $exists: true } },
              {
                fields: { username: 1, emails: 1 },
                limit: 10000,
              }
            )
            .fetchAsync()
        : currentHost.members || [];

      if (members.length === 0) {
        throw new Meteor.Error('No members found to send newsletter to');
      }

      // Send emails in batches to avoid memory overflow on large member lists
      const BATCH_SIZE = 20;
      const results = [];

      for (let i = 0; i < members.length; i += BATCH_SIZE) {
        const batch = members.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.allSettled(
          batch.map(async (member) => {
            const emailAddress = isPortalHost
              ? member?.emails?.[0]?.address
              : member?.email;
            if (!emailAddress) {
              return {
                status: 'skipped',
                reason: 'No email address',
                member: member._id,
              };
            }

            const emailHtmlWithUsername = emailHtmlWithBrowserLink.replace(
              '[username]',
              member.username || 'there'
            );

            try {
              await Meteor.callAsync(
                'sendEmail',
                emailAddress,
                email.subject,
                emailHtmlWithUsername
              );
              console.log('sent to:', emailAddress);
              return { status: 'sent', member: member._id };
            } catch (error) {
              console.error('failed to send to:', emailAddress);
              return {
                status: 'failed',
                error: error.message,
                member: member._id,
              };
            }
          })
        );
        results.push(...batchResults);
      }

      // Log summary
      const sentCount = results.filter(
        (r) => r.value?.status === 'sent'
      ).length;
      const failedCount = results.filter(
        (r) => r.value?.status === 'failed'
      ).length;

      console.log(
        `Newsletter ${newEmailId}: Sent ${sentCount}, Failed ${failedCount}`
      );

      return {
        newsletterId: newEmailId,
        sent: sentCount,
        failed: failedCount,
        total: members.length,
      };
    } catch (error) {
      console.error('Newsletter sending failed:', error);
      throw new Meteor.Error(error);
    }
  },
});
