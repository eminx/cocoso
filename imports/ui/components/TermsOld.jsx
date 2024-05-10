import { Meteor } from 'meteor/meteor';
import React from 'react';

const publicSettings = Meteor.settings.public;

function TermsOld() {
  return (
    <div>
      <h3>{publicSettings.name} user agreement</h3>
      <p>
        With an account, you are a member and can join any one or all of our study group’s online
        forums free of charge. If you join a study group, you will receive running updates about
        meetings for that group and can communicate with other participants via a discussion
        available at all times. Your username will be visible to other members on each group page
        you are a member of, both in the list of a group’s members and in a group’s discussion
        window.
      </p>
      <p>
        As a member you will also receive running notifications about things happening at{' '}
        {publicSettings.name}, and can sign yourself up (RSVP) for events with a simple click. Your
        username will be visible for staff members in the list of attendees.
      </p>
      <p>
        The discussions for each study group are visible to all members of
        {publicSettings.name}. These discussions are kept for the duration of the group and will be
        archived, but can be erased if the group wishes.
      </p>
      <p>
        {publicSettings.name} expects all members to keep respectful and supportive language when
        communicating. We want to ensure a friendly and welcoming environment, while encouraging
        critical thinking and constructive dialogue. Members who go against these simple rules run
        the risk of having their membership removed.
      </p>
      <p>
        Your personal information will never be shared with any external party. You can easily
        delete your membership anytime you want.
      </p>
      <p>
        For more information about how your personal information is handled, see our GDPR policy.
      </p>

      <h3>{publicSettings.name}'s data policy, GDPR</h3>
      <p>
        GDPR (General Data Protection Regulation) is an EU law that regulates how you as a user own
        your personal information and how you have the right to see it and know how it is used.
        Parties that collect, use, and store your private information do so only on loan, and must
        promise you that they will protect it against intrusion and store it safely according to the
        law. You must have knowledge of, and be able to agree or decline, as well as terminate, any
        usage and storage of your personal information.
      </p>
      <h4>What data we collect, how we store it, and why</h4>
      <p>
        {publicSettings.name} collects only two pieces of information: a username and an e-mail
        address. Your e-mail address is considered personal information. The name you choose does
        not have to be your legal name, so if you choose to use your legal name you do so at your
        own discretion. This name will be displayed on the website only to other members: in the
        member list of groups you have joined; when sending discussion messages; and in the RSVP
        list when attending events (this latter visible only to staff).
      </p>
      <p>
        We use your e-mail address to send you notifications. {publicSettings.name} collects this
        information when you sign up for an account, as well as when you change your account
        information. To login you will be asked to provide a password for your account. It is your
        responsibility to ensure this password is stored securely and is sufficiently robust.
      </p>

      <h3>Data storage</h3>
      <p>
        {publicSettings.name} uses cookies in your web browser for the sole purpose of storing your
        password. Your password is encrypted in our database, so there is no way we can access or
        read it. Your connection to {publicSettings.name} is also encrypted using SSL (HTTPS).
      </p>
      <p>
        The list of e-mail addresses is secure and can be accessed only by the systems administrator
        and the website administrator.
      </p>
      <p>
        Discussion entries in groups associated with your username are stored for the duration of
        the group and are archived if the group ends and agrees to save its material. They are
        deleted only if the group requests it. Note that specifically deleting only the discussion
        entries associated with your own account is difficult and we may not be able to provide that
        service on request.
      </p>

      <h3>Data sharing</h3>
      <p>
        We will never share or leave any of your personal information with any third party. We do
        not use any form of tracking, either on our own servers or via third parties.
      </p>

      <h3>Access outside the EU/EES</h3>
      <p>
        The GDPR does not apply to countries outside the EU or EES. Your data accessible to third
        parties when accessed on a device outside the EU is not under the GDPR’s jurisdiction.
      </p>

      <h3>Requesting information about your personal information</h3>
      <p>
        You can contact {publicSettings.name} via e-mail to request anything about your personal
        information—what we store, how it is used, and if you want to change or remove it.
      </p>

      <h3>Account deletion</h3>
      <p>
        You can delete your account at any time, which will delete all personal information
        associated with it. This can be accomplished by the “delete account” button on your user
        page, or by e-mailing us.
      </p>

      <h3>How long is information stored?</h3>
      <p>
        Your personal information will be stored as long as you have an active account. We will
        regularly remove long inactive accounts.
      </p>

      <p>
        Datainspektion regulates how organisations can handle personal information. If your want to
        know more about your data protection rights, or report a violation of your rights, go to
        www.datainspektionen.se or call +46(0)86576100.
      </p>
    </div>
  );
}

export default TermsOld;
