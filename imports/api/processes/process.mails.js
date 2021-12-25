import { siteUrl } from '../@/shared';
const publicSettings = Meteor.settings.public;

const getProcessJoinText = (
  firstName, 
  processTitle, 
  processId
  ) => {
  return `
  Hi ${firstName},\n\n
  This is a confirmation email to inform you that you have successfully joined the process called "${processTitle}".\n\n
  We are very excited to have you participate this little school we have founded and look forward to learning with you.\n
  You are encouraged to follow the updates, register to attend meetings and join the discussion at the process page: ${siteUrl}process/${processId}.\n\n
  We look forward to your participation.\n${publicSettings.name} Team
  `;
};

const getProcessLeaveText = (
  firstName, 
  processTitle, 
  processId
  ) => {
  return `
  Hi ${firstName},\n\n
  This is a confirmation email to inform you that you have successfully left the study process called "${processTitle}".\n
  If you want to join the process again, you can do so here at the process page: ${siteUrl}process/${processId}.\n\n
  Kind regards,\n${publicSettings.name} Team
  `;
};

const getMeetingAttendText = (
  firstName,
  occurence,
  processTitle,
  processId
  ) => {
  return `
  Hi ${firstName},\n\n
  This is a confirmation email to inform you that you have successfully registered your attendance for the meeting on ${occurence.startDate} at ${occurence.startTime} as part of the study process called "${processTitle}".\nMay there be any changes to your attendance, please update and inform your friends at the process page: ${siteUrl}process/${processId}.\n\n
  You are encouraged to follow the updates, register to attend meetings and join the discussion at this page.\n\n
  We look forward to your participation.\n${publicSettings.name} Team
  `;
};

const getMeetingUnattendText = (
  firstName,
  occurence,
  processTitle,
  processId
  ) => {
  return `
  Hi ${firstName},\n\n
  This is a confirmation email to inform you that we have successfully removed your attendance from the meeting on ${occurence.startDate} at ${occurence.startTime} as part of the study process called "${processTitle}".\nMay there be any changes to your attendance, please update and inform your friends at the process page: ${siteUrl}process/${processId}.\n\n
  You are encouraged to follow the updates, register to attend meetings and join the discussion at this page.\n\n
  We look forward to your participation.\n${publicSettings.name} Team
  `;
};

const getInviteToPrivateProcessText = (
  firstName,
  processTitle,
  processId,
  processAdmin
  ) => {
  return `
  Hi ${firstName},\n\n
  This is an email to invite you to a private process entitled ${processTitle} created by ${processAdmin}.\n\n
  If you wish to accept this invite and join the process, simply go to the process page and click the "Join" button: ${siteUrl}process/${processId}.\n\n
  Please bear in mind that you have to have an account at the ${publicSettings.name} App, or create one, with this email address to which you received this email.\n\n
  You are encouraged to follow the updates, register to attend meetings and join the discussion at this page.\n\n
  We look forward to your participation.\n${publicSettings.name} Team
  `;
};


export {
  getProcessJoinText,
  getProcessLeaveText,
  getMeetingAttendText,
  getMeetingUnattendText,
  getInviteToPrivateProcessText,
};