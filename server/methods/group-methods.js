import { Meteor } from 'meteor/meteor';
import { getRoomIndex, siteUrl, getHost } from './shared';

const publicSettings = Meteor.settings.public;
const contextName = publicSettings.contextName;

const getGroupJoinText = (firstName, groupTitle, groupId) => {
  return `Hi ${firstName},\n\nThis is a confirmation email to inform you that you have successfully joined the group called "${groupTitle}".\n\nWe are very excited to have you participate this little school we have founded and look forward to learning with you.\nYou are encouraged to follow the updates, register to attend meetings and join the discussion at the group page: ${siteUrl}group/${groupId}.\n\nWe look forward to your participation.\n${contextName} Team`;
};

const getGroupLeaveText = (firstName, groupTitle, groupId) => {
  return `Hi ${firstName},\n\nThis is a confirmation email to inform you that you have successfully left the study group called "${groupTitle}".\nIf you want to join the group again, you can do so here at the group page: ${siteUrl}group/${groupId}.\n\nKind regards,\n${contextName} Team`;
};

const getMeetingAttendText = (firstName, occurence, groupTitle, groupId) => {
  return `Hi ${firstName},\n\nThis is a confirmation email to inform you that you have successfully registered your attendance for the meeting on ${
    occurence.startDate
  } at ${
    occurence.startTime
  } as part of the study group called "${groupTitle}".\nMay there be any changes to your attendance, please update and inform your friends at the group page: ${siteUrl}group/${groupId}.\n\nYou are encouraged to follow the updates, register to attend meetings and join the discussion at this page.\n\nWe look forward to your participation.\n${contextName} Team`;
};

const getMeetingUnattendText = (firstName, occurence, groupTitle, groupId) => {
  return `Hi ${firstName},\n\nThis is a confirmation email to inform you that we have successfully removed your attendance from the meeting on ${
    occurence.startDate
  } at ${
    occurence.startTime
  } as part of the study group called "${groupTitle}".\nMay there be any changes to your attendance, please update and inform your friends at the group page: ${siteUrl}group/${groupId}.\n\nYou are encouraged to follow the updates, register to attend meetings and join the discussion at this page.\n\nWe look forward to your participation.\n${contextName} Team`;
};

const getInviteToPrivateGroupText = (
  firstName,
  groupTitle,
  groupId,
  groupAdmin
) => {
  return `Hi ${firstName},\n\nThis is an email to invite you to a private group entitled ${groupTitle} created by ${groupAdmin}.\n\nIf you wish to accept this invite and join the group, simply go to the group page and click the "Join" button: ${siteUrl}group/${groupId}.\n\nPlease bear in mind that you have to have an account at the ${contextName} App, or create one, with this email address to which you received this email.\n\nYou are encouraged to follow the updates, register to attend meetings and join the discussion at this page.\n\nWe look forward to your participation.\n${contextName} Team`;
};

const compareForSort = (a, b) => {
  const dateA = new Date(a.endDate);
  const dateB = new Date(b.endDate);
  return dateA - dateB;
};

Meteor.methods({
  createGroup(formValues, imageUrl, isPrivate = false) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }
    check(formValues.title, String);
    check(formValues.description, String);
    check(formValues.readingMaterial, String);
    check(formValues.capacity, Number);

    const host = getHost(this);
    console.log(imageUrl);
    try {
      const add = Groups.insert(
        {
          host,
          adminId: user._id,
          adminUsername: user.username,
          members: [
            {
              memberId: user._id,
              username: user.username,
              profileImage: user.profileImage || null,
              joinDate: new Date()
            }
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
          creationDate: new Date()
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
            groups: {
              groupId: add,
              name: formValues.title,
              joinDate: new Date(),
              meAdmin: true
            }
          }
        });
      } catch (error) {
        console.log(error);
        throw new Meteor.Error(
          error,
          "Couldn't add the group info to user collection, but group is created"
        );
      }
      return add;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't add group to the collection");
    }
  },

  updateGroup(groupId, formValues, imageUrl) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    if (user._id !== theGroup.adminId) {
      throw new Meteor.Error('You are not allowed!');
    }

    check(formValues.title, String);
    check(formValues.description, String);
    check(formValues.capacity, Number);

    try {
      const add = Groups.update(groupId, {
        $set: {
          title: formValues.title,
          description: formValues.description,
          readingMaterial: formValues.readingMaterial,
          capacity: formValues.capacity,
          imageUrl
        }
      });
      return groupId;
    } catch (e) {
      throw new Meteor.Error(e, "Couldn't update the group");
    }
  },

  deleteGroup(groupId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }
    const groupToDelete = Groups.findOne(groupId);
    if (groupToDelete.adminId !== user._id) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Groups.remove(groupId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },

  joinGroup(groupId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    try {
      Groups.update(theGroup._id, {
        $addToSet: {
          members: {
            memberId: user._id,
            username: user.username,
            profileImage: user.profileImage || null,
            isRegisteredMember: user.isRegisteredMember,
            joinDate: new Date()
          }
        }
      });
      Meteor.users.update(user._id, {
        $addToSet: {
          groups: {
            groupId: theGroup._id,
            name: theGroup.title,
            joinDate: new Date()
          }
        }
      });
      Meteor.call(
        'sendEmail',
        user._id,
        `"${theGroup.title}" at ${contextName}`,
        getGroupJoinText(
          user.firstName || user.username,
          theGroup.title,
          groupId
        )
      );
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, 'Could not join the circle');
    }
  },

  leaveGroup(groupId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    try {
      Groups.update(theGroup._id, {
        $pull: {
          members: {
            memberId: user._id
          }
        }
      });
      Meteor.users.update(user._id, {
        $pull: {
          groups: {
            groupId: groupId
          }
        }
      });
      Meteor.call(
        'sendEmail',
        user._id,
        `"${theGroup.title}" at ${contextName}`,
        getGroupLeaveText(
          user.firstName || user.username,
          theGroup.title,
          groupId
        )
      );
    } catch (error) {
      throw new Meteor.Error('Could not leave the group');
    }
  },

  addGroupMeeting(newMeeting, groupId) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    if (theGroup.adminId !== user._id) {
      throw new Meteor.Error('You are not the admin!');
    }

    newMeeting.attendees = [];
    newMeeting.roomIndex = getRoomIndex(newMeeting.room);
    const meetings = [...theGroup.meetings, newMeeting];
    const sortedMeetings = meetings.sort(compareForSort);

    try {
      Groups.update(groupId, {
        $set: {
          meetings: sortedMeetings
        }
      });
    } catch (error) {
      throw new Meteor.Error(
        'Could not create the meeting due to:',
        error.reason
      );
    }
  },

  deleteMeeting(groupId, meetingIndex) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    if (theGroup.adminId !== user._id) {
      throw new Meteor.Error('You are not the admin!');
    }

    const newMeetings = theGroup.meetings.filter(
      (meeting, mIndex) => mIndex !== meetingIndex
    );

    try {
      Groups.update(groupId, {
        $set: {
          meetings: newMeetings
        }
      });
    } catch (error) {
      throw new Meteor.Error(
        'Could not remove the meeting due to: ',
        error.reason
      );
    }
  },

  attendMeeting(groupId, meetingIndex) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    if (!theGroup.members.map(member => member.memberId).includes(user._id)) {
      throw new Meteor.Error('You are not a member!');
    }

    const updatedMeetings = [...theGroup.meetings];
    updatedMeetings[meetingIndex].attendees.push({
      memberId: user._id,
      memberUsername: user.username,
      confirmDate: new Date()
    });

    try {
      Groups.update(groupId, {
        $set: {
          meetings: updatedMeetings
        }
      });
      Meteor.call(
        'sendEmail',
        user._id,
        `"${theGroup.title}" at ${contextName}`,
        getMeetingAttendText(
          user.firstName || user.username,
          updatedMeetings[meetingIndex],
          theGroup.title,
          groupId
        )
      );
    } catch (error) {
      throw new Meteor.Error(
        'Could not registered attendance due to:',
        error.reason
      );
    }
  },

  unAttendMeeting(groupId, meetingIndex) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    if (!theGroup.members.map(member => member.memberId).includes(user._id)) {
      throw new Meteor.Error('You are not a member!');
    }

    const updatedMeetings = [...theGroup.meetings];
    const theAttendees = [...updatedMeetings[meetingIndex].attendees];
    const theAttendeesWithout = theAttendees.filter(
      attendee => attendee.memberId !== user._id
    );
    updatedMeetings[meetingIndex].attendees = theAttendeesWithout;

    try {
      Groups.update(groupId, {
        $set: {
          meetings: updatedMeetings
        }
      });
      Meteor.call(
        'sendEmail',
        user._id,
        `"${theGroup.title}" at ${contextName}`,
        getMeetingUnattendText(
          user.firstName || user.username,
          updatedMeetings[meetingIndex],
          theGroup.title,
          groupId
        )
      );
    } catch (error) {
      throw new Meteor.Error(
        'Could not removed attendance due to:',
        error.reason
      );
    }
  },

  addGroupDocument(document, groupId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    if (theGroup.adminId !== user._id) {
      throw new Meteor.Error('You are not admin!');
    }

    try {
      Groups.update(groupId, {
        $push: {
          documents: document
        }
      });
    } catch (error) {
      throw new Meteor.Error('Could not add document due to:', error.reason);
    }
  },

  removeGroupDocument(documentName, groupId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    if (theGroup.adminId !== user._id) {
      throw new Meteor.Error('You are not admin!');
    }

    const newDocuments = theGroup.documents.filter(
      document => document.name !== documentName
    );

    try {
      Groups.update(groupId, {
        $set: {
          documents: newDocuments
        }
      });
    } catch (error) {
      throw new Meteor.Error(
        'Could not remove the document because: ',
        error.reason
      );
    }
  },

  changeAdmin(groupId, newAdminUsername) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    if (theGroup.adminId !== user._id) {
      throw new Meteor.Error('You are not admin!');
    }

    const newAdmin = Meteor.users.findOne({ username: newAdminUsername });

    if (!newAdmin.isRegisteredMember) {
      throw new Meteor.Error('This is not allowed!');
      return;
    }

    try {
      Groups.update(groupId, {
        $set: {
          adminId: newAdmin._id,
          adminUsername: newAdminUsername
        }
      });
    } catch (error) {
      throw new Meteor.Error('Could not change admin due to :', error.reason);
    }
  },

  archiveGroup(groupId) {
    const user = Meteor.user();
    const theGroup = Groups.findOne(groupId);
    if (theGroup.adminId !== user._id && !user.isSuperAdmin) {
      throw new Meteor.Error('You do not have admin privileges!');
    }

    try {
      Groups.update(groupId, {
        $set: {
          isArchived: true
        }
      });
    } catch (error) {
      throw new Meteor.Error('Could not archive the group', error);
    }
  },

  unarchiveGroup(groupId) {
    const user = Meteor.user();
    const theGroup = Groups.findOne(groupId);
    if (theGroup.adminId !== user._id && !user.isSuperAdmin) {
      throw new Meteor.Error('You are not admin!');
    }

    try {
      Groups.update(groupId, {
        $set: {
          isArchived: false
        }
      });
    } catch (error) {
      throw new Meteor.Error('Could not unarchive the group', error);
    }
  },

  invitePersonToPrivateGroup(groupId, person) {
    const user = Meteor.user();
    const theGroup = Groups.findOne(groupId);
    if (theGroup.adminId !== user._id && !user.isSuperAdmin) {
      throw new Meteor.Error('You are not admin!');
    }

    if (!theGroup.isPrivate) {
      throw new Meteor.Error('This group is not private');
    }

    const invitedEmailsList = theGroup.peopleInvited.map(
      person => person.email
    );

    if (invitedEmailsList.indexOf(person.email) !== -1) {
      throw new Meteor.Error('This email address is already added to the list');
    }

    try {
      Meteor.call(
        'sendEmail',
        person.email,
        `Invitation to join the group "${
          theGroup.title
        }" at ${contextName} by ${user.username}`,
        getInviteToPrivateGroupText(
          person.firstName,
          theGroup.title,
          theGroup._id,
          user.username
        )
      );

      Groups.update(groupId, {
        $addToSet: {
          peopleInvited: {
            email: person.email,
            firstName: person.firstName
          }
        }
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, 'Could not send the invite to the person');
    }
  }
});
