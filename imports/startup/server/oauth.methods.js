import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

import Memberships from '/imports/api/memberships/membership';
import Platform from '/imports/api/platform/platform';
import Hosts from '/imports/api/hosts/host';
import { getWelcomeEmailBody } from '/imports/api/_utils/services/mails/templates.mails';
import { extractEmailAddress } from '/imports/api/_utils/services/mails/mail.helpers';

const ROLE = 'participant';
const PORTAL_ROLE = 'participant';

const fromEmail = Meteor.settings.mailCredentials.smtp.fromEmail;

export async function joinHost(userId, host) {
  const platform = await Platform.findOneAsync();
  if (!platform) {
    console.error('no platform!');
    return;
  }
  const isFederationLayout = platform.isFederationLayout;
  const portalHost = platform.portalHost;
  const isPortal = portalHost === host;
  const roleAssigned = isPortal ? PORTAL_ROLE : ROLE;
  try {
    await Memberships.upsertAsync(
      { userId, host },
      {
        $setOnInsert: {
          role: roleAssigned,
          joinDate: new Date(),
          isPublic: true,
        },
      }
    );
    await sendWelcomeEmail(userId, host);

    if (isPortal || !isFederationLayout) {
      return;
    }
    await Memberships.upsertAsync(
      { userId, host: portalHost },
      {
        $setOnInsert: {
          role: PORTAL_ROLE,
          joinDate: new Date(),
          isPublic: true,
        },
      }
    );
    await sendWelcomeEmail(userId, portalHost);
  } catch (error) {
    if (error.code !== 11000) {
      console.error('[oauth] join host failed', { userId, host, error });
    }
  }
}

export async function sendWelcomeEmail(userId, host) {
  if (!userId || !host) {
    console.error('[oauth] sendWelcomeEmail: missing args', { userId, host });
    return;
  }

  const user = await Meteor.users.findOneAsync(userId);
  const hostDoc = await Hosts.findOneAsync({ host });
  const welcomeText = hostDoc && hostDoc.emails?.[0];

  if (!welcomeText) {
    console.warn('[oauth] no welcome template for host', { host });
    return;
  }

  const emailBody = getWelcomeEmailBody(
    welcomeText?.appeal,
    hostDoc,
    user?.username,
    welcomeText?.body
  );

  const hostName = hostDoc?.settings?.name;
  const extractedEmail = extractEmailAddress(fromEmail);
  const fromEmailWithHostName = `${hostName} <${extractedEmail}>`;

  const data = {
    from: fromEmailWithHostName,
    to: user?.emails?.[0]?.address,
    subject: welcomeText?.subject,
    html: emailBody,
  };

  try {
    await Email.sendAsync(data);
  } catch (error) {
    console.error('[oauth] welcome email failed', { userId, host, error });
    throw error;
  }
}
