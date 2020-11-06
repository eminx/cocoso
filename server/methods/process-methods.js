import { Meteor } from 'meteor/meteor';
import {
  getRoomIndex,
  siteUrl,
  getHost,
  isContributorOrAdmin,
  isParticipant,
} from './shared';

const publicSettings = Meteor.settings.public;
const contextName = publicSettings.contextName;

const getProcessJoinText = (firstName, processTitle, processId) => {
  return `Hi ${firstName},\n\nThis is a confirmation email to inform you that you have successfully joined the process called "${processTitle}".\n\nWe are very excited to have you participate this little school we have founded and look forward to learning with you.\nYou are encouraged to follow the updates, register to attend meetings and join the discussion at the process page: ${siteUrl}process/${processId}.\n\nWe look forward to your participation.\n${contextName} Team`;
};

const getProcessLeaveText = (firstName, processTitle, processId) => {
  return `Hi ${firstName},\n\nThis is a confirmation email to inform you that you have successfully left the study process called "${processTitle}".\nIf you want to join the process again, you can do so here at the process page: ${siteUrl}process/${processId}.\n\nKind regards,\n${contextName} Team`;
};

const getMeetingAttendText = (
  firstName,
  occurence,
  processTitle,
  processId
) => {
  return `Hi ${firstName},\n\nThis is a confirmation email to inform you that you have successfully registered your attendance for the meeting on ${occurence.startDate} at ${occurence.startTime} as part of the study process called "${processTitle}".\nMay there be any changes to your attendance, please update and inform your friends at the process page: ${siteUrl}process/${processId}.\n\nYou are encouraged to follow the updates, register to attend meetings and join the discussion at this page.\n\nWe look forward to your participation.\n${contextName} Team`;
};

const getMeetingUnattendText = (
  firstName,
  occurence,
  processTitle,
  processId
) => {
  return `Hi ${firstName},\n\nThis is a confirmation email to inform you that we have successfully removed your attendance from the meeting on ${occurence.startDate} at ${occurence.startTime} as part of the study process called "${processTitle}".\nMay there be any changes to your attendance, please update and inform your friends at the process page: ${siteUrl}process/${processId}.\n\nYou are encouraged to follow the updates, register to attend meetings and join the discussion at this page.\n\nWe look forward to your participation.\n${contextName} Team`;
};

const getInviteToPrivateProcessText = (
  firstName,
  processTitle,
  processId,
  processAdmin
) => {
  return `Hi ${firstName},\n\nThis is an email to invite you to a private process entitled ${processTitle} created by ${processAdmin}.\n\nIf you wish to accept this invite and join the process, simply go to the process page and click the "Join" button: ${siteUrl}process/${processId}.\n\nPlease bear in mind that you have to have an account at the ${contextName} App, or create one, with this email address to which you received this email.\n\nYou are encouraged to follow the updates, register to attend meetings and join the discussion at this page.\n\nWe look forward to your participation.\n${contextName} Team`;
};

const compareForSort = (a, b) => {
  const dateA = new Date(a.endDate);
  const dateB = new Date(b.endDate);
  return dateA - dateB;
};

Meteor.methods({
  createProcess(formValues, imageUrl, isPrivate = false) {
    const user = Meteor.user();
    const host = getHost(this);

    const isContributorOrAdmin = isContributorOrAdmin(user, host);

    if (!user || !isContributorOrAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    check(formValues.title, String);
    check(formValues.description, String);
    check(formValues.readingMaterial, String);
    check(formValues.capacity, Number);

    try {
      const add = Processes.insert(
        {
          host,
          adminId: user._id,
          adminUsername: user.username,
          members: [
            {
              memberId: user._id,
              username: user.username,
              profileImage: user.profileImage || null,
              joinDate: new Date(),
            },
          ],
          documents: [],
          meetings: [],
          title: formValues.title,
          description: formValues.description,
          readingMaterial: formValues.readingMaterial,
          capacity: formValues.capacity || 20,
          imageUrl,
          isPublished: true,
          isPrivate: isPrivate,
          peopleInvited: [],
          creationDate: new Date(),
        },
        () => {
          Meteor.call('createChat', formValues.title, add, (error, result) => {
            if (error) {
              console.log('Chat is not created due to error: ', error);
            }
          });
        }
      );

      try {
        Meteor.users.update(user._id, {
          $addToSet: {
            processes: {
              processId: add,
              name: formValues.title,
              joinDate: new Date(),
              isAdmin: true,
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw new Meteor.Error(
          error,
          "Couldn't add the process info to user collection, but process is created"
        );
      }
      return add;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't add process to the collection");
    }
  },

  updateProcess(processId, formValues, imageUrl) {
    const user = Meteor.user();
    const host = getHost(this);

    const isContributorOrAdmin = isContributorOrAdmin(user, host);

    if (!user || !isContributorOrAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (user._id !== theProcess.adminId) {
      throw new Meteor.Error('You are not allowed!');
    }

    check(formValues.title, String);
    check(formValues.description, String);
    check(formValues.capacity, Number);

    try {
      const add = Processes.update(processId, {
        $set: {
          title: formValues.title,
          description: formValues.description,
          readingMaterial: formValues.readingMaterial,
          capacity: formValues.capacity,
          imageUrl,
        },
      });
      return processId;
    } catch (e) {
      throw new Meteor.Error(e, "Couldn't update the process");
    }
  },

  deleteProcess(processId) {
    const user = Meteor.user();
    const host = getHost(this);

    const isContributorOrAdmin = isContributorOrAdmin(user, host);

    if (!user || !isContributorOrAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    const processToDelete = Processes.findOne(processId);
    if (processToDelete.adminId !== user._id) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Processes.remove(processId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },

  joinProcess(processId) {
    const user = Meteor.user();
    const host = getHost(this);

    const isParticipant = isParticipant(user, host);

    if (!user || !isParticipant) {
      throw new Meteor.Error('Please become a participant at this host first!');
    }

    const theProcess = Processes.findOne(processId);
    try {
      Processes.update(theProcess._id, {
        $addToSet: {
          members: {
            memberId: user._id,
            username: user.username,
            profileImage: user.profileImage || null,
            joinDate: new Date(),
          },
        },
      });
      Meteor.users.update(user._id, {
        $addToSet: {
          processes: {
            processId: theProcess._id,
            name: theProcess.title,
            joinDate: new Date(),
          },
        },
      });
      Meteor.call(
        'sendEmail',
        user._id,
        `"${theProcess.title}" at ${contextName}`,
        getProcessJoinText(
          user.firstName || user.username,
          theProcess.title,
          processId
        )
      );
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, 'Could not join the circle');
    }
  },

  leaveProcess(processId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    try {
      Processes.update(theProcess._id, {
        $pull: {
          members: {
            memberId: user._id,
          },
        },
      });
      Meteor.users.update(user._id, {
        $pull: {
          processes: {
            processId: processId,
          },
        },
      });
      Meteor.call(
        'sendEmail',
        user._id,
        `"${theProcess.title}" at ${contextName}`,
        getProcessLeaveText(
          user.firstName || user.username,
          theProcess.title,
          processId
        )
      );
    } catch (error) {
      throw new Meteor.Error('Could not leave the process');
    }
  },

  addProcessMeeting(newMeeting, processId) {
    const user = Meteor.user();
    const host = getHost(this);

    const isContributorOrAdmin = isContributorOrAdmin(user, host);

    if (!user || !isContributorOrAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (theProcess.adminId !== user._id) {
      throw new Meteor.Error('You are not the admin!');
    }

    newMeeting.attendees = [];
    newMeeting.roomIndex = getRoomIndex(newMeeting.room);
    const meetings = [...theProcess.meetings, newMeeting];
    const sortedMeetings = meetings.sort(compareForSort);

    try {
      Processes.update(processId, {
        $set: {
          meetings: sortedMeetings,
        },
      });
    } catch (error) {
      throw new Meteor.Error(
        'Could not create the meeting due to:',
        error.reason
      );
    }
  },

  deleteMeeting(processId, meetingIndex) {
    const user = Meteor.user();
    const host = getHost(this);

    const isContributorOrAdmin = isContributorOrAdmin(user, host);

    if (!user || !isContributorOrAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (theProcess.adminId !== user._id) {
      throw new Meteor.Error('You are not the admin!');
    }

    const newMeetings = theProcess.meetings.filter(
      (meeting, mIndex) => mIndex !== meetingIndex
    );

    try {
      Processes.update(processId, {
        $set: {
          meetings: newMeetings,
        },
      });
    } catch (error) {
      throw new Meteor.Error(
        'Could not remove the meeting due to: ',
        error.reason
      );
    }
  },

  attendMeeting(processId, meetingIndex) {
    const user = Meteor.user();
    const host = getHost(this);

    const isParticipant = isParticipant(user, host);

    if (!user || !isParticipant) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (
      !theProcess.members.map((member) => member.memberId).includes(user._id)
    ) {
      throw new Meteor.Error('You are not a member!');
    }

    const updatedMeetings = [...theProcess.meetings];
    updatedMeetings[meetingIndex].attendees.push({
      memberId: user._id,
      memberUsername: user.username,
      confirmDate: new Date(),
    });

    try {
      Processes.update(processId, {
        $set: {
          meetings: updatedMeetings,
        },
      });
      Meteor.call(
        'sendEmail',
        user._id,
        `"${theProcess.title}" at ${contextName}`,
        getMeetingAttendText(
          user.firstName || user.username,
          updatedMeetings[meetingIndex],
          theProcess.title,
          processId
        )
      );
    } catch (error) {
      throw new Meteor.Error(
        'Could not registered attendance due to:',
        error.reason
      );
    }
  },

  unAttendMeeting(processId, meetingIndex) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (
      !theProcess.members.map((member) => member.memberId).includes(user._id)
    ) {
      throw new Meteor.Error('You are not a member!');
    }

    const updatedMeetings = [...theProcess.meetings];
    const theAttendees = [...updatedMeetings[meetingIndex].attendees];
    const theAttendeesWithout = theAttendees.filter(
      (attendee) => attendee.memberId !== user._id
    );
    updatedMeetings[meetingIndex].attendees = theAttendeesWithout;

    try {
      Processes.update(processId, {
        $set: {
          meetings: updatedMeetings,
        },
      });
      Meteor.call(
        'sendEmail',
        user._id,
        `"${theProcess.title}" at ${contextName}`,
        getMeetingUnattendText(
          user.firstName || user.username,
          updatedMeetings[meetingIndex],
          theProcess.title,
          processId
        )
      );
    } catch (error) {
      throw new Meteor.Error(
        'Could not removed attendance due to:',
        error.reason
      );
    }
  },

  addProcessDocument(document, processId) {
    const user = Meteor.user();
    const host = getHost(this);

    const isContributorOrAdmin = isContributorOrAdmin(user, host);

    if (!user || !isContributorOrAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (theProcess.adminId !== user._id) {
      throw new Meteor.Error('You are not admin!');
    }

    try {
      Processes.update(processId, {
        $push: {
          documents: document,
        },
      });
    } catch (error) {
      throw new Meteor.Error('Could not add document due to:', error.reason);
    }
  },

  removeProcessDocument(documentName, processId) {
    const user = Meteor.user();
    const host = getHost(this);

    const isContributorOrAdmin = isContributorOrAdmin(user, host);

    if (!user || !isContributorOrAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (theProcess.adminId !== user._id) {
      throw new Meteor.Error('You are not admin!');
    }

    const newDocuments = theProcess.documents.filter(
      (document) => document.name !== documentName
    );

    try {
      Processes.update(processId, {
        $set: {
          documents: newDocuments,
        },
      });
    } catch (error) {
      throw new Meteor.Error(
        'Could not remove the document because: ',
        error.reason
      );
    }
  },

  changeAdmin(processId, newAdminUsername) {
    const user = Meteor.user();
    const host = getHost(this);

    const isContributorOrAdmin = isContributorOrAdmin(user, host);

    if (!user || !isContributorOrAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (theProcess.adminId !== user._id) {
      throw new Meteor.Error('You are not admin!');
    }

    const newAdmin = Meteor.users.findOne({ username: newAdminUsername });

    if (!isContributorOrAdmin(newAdmin, host)) {
      throw new Meteor.Error('The new admin must be a contributor');
    }

    try {
      Processes.update(processId, {
        $set: {
          adminId: newAdmin._id,
          adminUsername: newAdminUsername,
        },
      });
    } catch (error) {
      throw new Meteor.Error('Could not change admin due to :', error.reason);
    }
  },

  archiveProcess(processId) {
    const user = Meteor.user();
    const host = getHost(this);

    const isContributorOrAdmin = isContributorOrAdmin(user, host);

    if (!user || !isContributorOrAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (theProcess.adminId !== user._id) {
      throw new Meteor.Error('You do not have admin privileges!');
    }

    try {
      Processes.update(processId, {
        $set: {
          isArchived: true,
        },
      });
    } catch (error) {
      throw new Meteor.Error('Could not archive the process', error);
    }
  },

  unarchiveProcess(processId) {
    const user = Meteor.user();
    const host = getHost(this);

    const isContributorOrAdmin = isContributorOrAdmin(user, host);

    if (!user || !isContributorOrAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (theProcess.adminId !== user._id) {
      throw new Meteor.Error('You are not admin!');
    }

    try {
      Processes.update(processId, {
        $set: {
          isArchived: false,
        },
      });
    } catch (error) {
      throw new Meteor.Error('Could not unarchive the process', error);
    }
  },

  invitePersonToPrivateProcess(processId, person) {
    const user = Meteor.user();
    const host = getHost(this);

    const isContributorOrAdmin = isContributorOrAdmin(user, host);

    if (!user || !isContributorOrAdmin) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (theProcess.adminId !== user._id) {
      throw new Meteor.Error('You are not admin!');
    }

    if (!theProcess.isPrivate) {
      throw new Meteor.Error('This process is not private');
    }

    const invitedEmailsList = theProcess.peopleInvited.map(
      (person) => person.email
    );

    if (invitedEmailsList.indexOf(person.email) !== -1) {
      throw new Meteor.Error('This email address is already added to the list');
    }

    try {
      Meteor.call(
        'sendEmail',
        person.email,
        `Invitation to join the process "${theProcess.title}" at ${contextName} by ${user.username}`,
        getInviteToPrivateProcessText(
          person.firstName,
          theProcess.title,
          theProcess._id,
          user.username
        )
      );

      Processes.update(processId, {
        $addToSet: {
          peopleInvited: {
            email: person.email,
            firstName: person.firstName,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, 'Could not send the invite to the person');
    }
  },
});
