const getRegistrationEmailBody = (
  firstName,
  numberOfPeople,
  occurence,
  activityId,
  hostName,
  host,
) => `
  <p>Hi ${firstName},</p>
  <p>This is a confirmation email to inform you that you have successfully signed up for this event.</p>
  <p>
    You have registered to come ${numberOfPeople} ${numberOfPeople === 1 ? 'person' : 'people'} 
    in total for the event on ${occurence.startDate} at ${occurence.startTime}.
  </p>
  <p>
    May there be any changes to that, please go to this link to change your RSVP: https://${host}/event/${activityId}. 
    <br />Then by opening the date you signed up for, click the "Change RSVP" link and follow the instructions there.
  </p>
  <p>
    We look forward to your participation. 
    <br />${hostName} Team
  </p>`;

const getUnregistrationEmailBody = (
  firstName,
  occurence,
  activityId,
  hostName,
  host,
) => `
  <p>Hi ${firstName},</p>
  <p>This is a confirmation email to inform you that you have successfully removed your registration from this event.</p>
  <p>You have previously registered to attend the event on ${occurence.startDate} at ${occurence.startTime}, which you just signed out of.</p>
  <p>If you want to RSVP again, you can do so here at the event page: https://${host}/event/${activityId}.</p>
  <p>
    Kind regards,
    <br />${hostName} Team
  </p>`;

export {
  getRegistrationEmailBody,
  getUnregistrationEmailBody,
};
