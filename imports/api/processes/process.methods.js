import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getHost, getResourceIndex } from '../_utils/shared';
import { isAdmin, isContributorOrAdmin, isMember } from '../users/user.roles';
import Hosts from '../hosts/host';
import Processes from './process';
import {
  getProcessJoinText,
  getProcessLeaveText,
  getMeetingAttendText,
  getMeetingUnattendText,
  getInviteToPrivateProcessText,
} from './process.mails';
import { compareForSort } from './process.helpers';

const publicSettings = Meteor.settings.public;

Meteor.methods({
  createProcess(formValues, imageUrl, isPrivate = false) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      const newProcessId = Processes.insert({
        host,
        adminId: user._id,
        adminUsername: user.username,
        adminAvatar: user.avatar,
        title: formValues.title,
        description: formValues.description,
        readingMaterial: formValues.readingMaterial,
        imageUrl,
        capacity: formValues.capacity,
        members: [
          {
            memberId: user._id,
            username: user.username,
            profileImage: user.profileImage,
            joinDate: new Date(),
          },
        ],
        isPublished: true,
        isPrivate,
        creationDate: new Date(),
      });

      Meteor.call('createChat', formValues.title, newProcessId, (error) => {
        if (error) {
          console.log('Chat is not created due to error: ', error);
        }
      });

      try {
        Meteor.users.update(user._id, {
          $addToSet: {
            processes: {
              processId: newProcessId,
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
      return newProcessId;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't add process to the collection");
    }
  },

  updateProcess(processId, formValues, imageUrl) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
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
      Processes.update(processId, {
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
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const processToDelete = Processes.findOne(processId);
    if (processToDelete.adminId !== user._id) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      Processes.remove(processId);
      return true;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },

  joinProcess(processId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isMember(user, currentHost)) {
      throw new Meteor.Error('Please sign up to become a participant at this host first!');
    }

    const theProcess = Processes.findOne(processId);

    const alreadyMember = theProcess.members.some((m) => m.memberId === user._id);

    if (alreadyMember) {
      throw new Meteor.Error('You are already a member');
    }

    const currentHostName = currentHost.settings?.name;

    try {
      Processes.update(theProcess._id, {
        $addToSet: {
          members: {
            memberId: user._id,
            username: user.username,
            profileImage: user.profileImage,
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
        `"${theProcess.title}" at ${currentHostName || publicSettings.name}`,
        getProcessJoinText(user.firstName || user.username, theProcess.title, processId, host)
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
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    const theProcess = Processes.findOne(processId);
    const currentHostName = currentHost.settings?.name;

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
            processId,
          },
        },
      });
      Meteor.call(
        'sendEmail',
        user._id,
        `"${theProcess.title}" at ${currentHostName || publicSettings.name}`,
        getProcessLeaveText(user.firstName || user.username, theProcess.title, processId, host)
      );
    } catch (error) {
      throw new Meteor.Error('Could not leave the process');
    }
  },

  addProcessDocument(document, processId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
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
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (theProcess.adminId !== user._id) {
      throw new Meteor.Error('You are not admin!');
    }

    const newDocuments = theProcess.documents.filter((document) => document.name !== documentName);

    try {
      Processes.update(processId, {
        $set: {
          documents: newDocuments,
        },
      });
    } catch (error) {
      throw new Meteor.Error('Could not remove the document because: ', error.reason);
    }
  },

  setAsAProcessAdmin(processId, newAdminUsername) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (!theProcess.members.some((member) => member.memberId === user._id && member.isAdmin)) {
      throw new Meteor.Error('You are not admin!');
    }

    const newAdmin = Meteor.users.findOne({ username: newAdminUsername });

    if (!isContributorOrAdmin(newAdmin, currentHost)) {
      throw new Meteor.Error('The new admin must be a contributor');
    }

    const newMembers = theProcess.members.map((member) => {
      if (member.username === newAdminUsername) {
        return {
          ...member,
          isAdmin: true,
        };
      }
      return {
        ...member,
      };
    });

    try {
      Processes.update(processId, {
        $set: {
          members: newMembers,
        },
      });
    } catch (error) {
      throw new Meteor.Error('Could not change admin due to :', error.reason);
    }
  },

  archiveProcess(processId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isAdmin(user, currentHost)) {
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
    const currentHost = Hosts.findOne({ host });

    if (!user || !isAdmin(user, currentHost)) {
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
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theProcess = Processes.findOne(processId);
    if (theProcess.adminId !== user._id) {
      throw new Meteor.Error('You are not admin!');
    }

    if (!theProcess.isPrivate) {
      throw new Meteor.Error('This process is not private');
    }

    const invitedEmailsList = theProcess.peopleInvited.map((p) => p.email);

    if (invitedEmailsList.indexOf(person.email) !== -1) {
      throw new Meteor.Error('This email address is already added to the list');
    }

    const currentHostName = currentHost.settings?.name;

    try {
      Meteor.call(
        'sendEmail',
        person.email,
        `Invitation to join the process "${theProcess.title}" at ${
          currentHostName || publicSettings.name
        } by ${user.username}`,
        getInviteToPrivateProcessText(
          person.firstName,
          theProcess.title,
          theProcess._id,
          user.username,
          host
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
