import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getHost } from '../_utils/shared';
import { isAdmin, isContributorOrAdmin, isMember } from '../users/user.roles';
import Hosts from '../hosts/host';
import Processes from './process';
import Activities from '../activities/activity';
import Platform from '../platform/platform';
import {
  getProcessRegistrationEmailBody,
  getInviteToPrivateProcessEmailBody,
} from './process.mails';

const publicSettings = Meteor.settings.public;

const isUserProcessAdmin = (process, userId) => {
  if (!process || !userId) {
    return false;
  }
  return process.members.some((member) => member.memberId === userId && member.isAdmin);
};

Meteor.methods({
  getProcesses(isPortalHost = false) {
    const user = Meteor.user();
    const host = getHost(this);
    const allProcesses = isPortalHost ? Processes.find().fetch() : Processes.find({ host }).fetch();
    const processesFiltered = allProcesses.filter((process) => {
      if (!process.isPrivate) {
        return true;
      }
      if (!user) {
        return false;
      }
      const userId = user._id;
      return (
        process.adminId === userId ||
        process.members.some((member) => member.memberId === userId) ||
        process.peopleInvited.some((person) => person.email === user.emails[0].address)
      );
    });

    return processesFiltered.map((process) => ({
      _id: process._id,
      title: process.title,
      readingMaterial: process.readingMaterial,
      description: process.description,
      imageUrl: process.imageUrl,
      meetings: process.meetings,
      host: process.host,
      adminUsername: process.adminUsername,
      isArchived: process.isArchived,
      members: user ? process.members : null,
      creationDate: process.creationDate,
      isPrivate: process.isPrivate,
      peopleInvited: process.peopleInvited,
    }));
  },

  getProcessesByUser(username) {
    if (!username) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = getHost(this);
    const platform = Platform.findOne();

    try {
      if (platform?.isFederationLayout) {
        return Processes.find({
          isPrivate: { $ne: true },
          isArchived: { $ne: true },
          $or: [{ authorUsername: username }, { 'members.username': username }],
        }).fetch();
      }
      return Processes.find({
        isPrivate: { $ne: true },
        isArchived: { $ne: true },
        $or: [{ authorUsername: username }, { 'members.username': username }],
        host,
      }).fetch();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch processes");
    }
  },

  createProcess(formValues, imageUrl, isPrivate = false) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const userAvatar = user.avatar ? user.avatar.src : null;

    try {
      const newProcessId = Processes.insert({
        host,
        authorId: user._id,
        authorUsername: user.username,
        authorAvatar: userAvatar,
        title: formValues.title,
        description: formValues.description,
        readingMaterial: formValues.readingMaterial,
        imageUrl,
        capacity: formValues.capacity,
        members: [
          {
            avatar: userAvatar,
            joinDate: new Date(),
            isAdmin: true,
            memberId: user._id,
            username: user.username,
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
    if (!isUserProcessAdmin(theProcess, user._id)) {
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

      Activities.update(
        {
          processId: processId,
        },
        {
          $set: {
            title: formValues.title,
            longDescription: formValues.description,
            imageUrl,
          },
        }
      );
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

    if (!isUserProcessAdmin(processToDelete, user._id)) {
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

    const currentHostName = currentHost?.settings?.name;
    const userAvatar = user.avatar ? user.avatar.src : null;
    const emailBody = getProcessRegistrationEmailBody(theProcess, currentHost, user);

    try {
      Processes.update(theProcess._id, {
        $addToSet: {
          members: {
            memberId: user._id,
            username: user.username,
            avatar: userAvatar,
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
      Meteor.call('sendEmail', user._id, `"${theProcess.title}", ${currentHostName}`, emailBody);
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
    const currentHostName = currentHost?.settings?.name;

    const emailBody = getProcessRegistrationEmailBody(theProcess, currentHost, user, true);
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
        `"${theProcess.title}", ${currentHostName || publicSettings.name}`,
        emailBody
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
    if (!isUserProcessAdmin(theProcess, user._id)) {
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
    if (!isUserProcessAdmin(theProcess, user._id)) {
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
    if (!isUserProcessAdmin(theProcess, user._id)) {
      throw new Meteor.Error('You are not admin!');
    }

    const newAdmin = Meteor.users.findOne({ username: newAdminUsername });

    if (!isContributorOrAdmin(newAdmin, currentHost)) {
      throw new Meteor.Error('Admins must either have a cocreator or admin role in the space');
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
    if (!isUserProcessAdmin(theProcess, user._id)) {
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
    if (!isUserProcessAdmin(theProcess, user._id)) {
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
    if (!isUserProcessAdmin(theProcess, user._id)) {
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
    const emailBody = getInviteToPrivateProcessEmailBody(theProcess, currentHost, user);
    try {
      Meteor.call(
        'sendEmail',
        person.email,
        `"${theProcess.title}", ${currentHostName}`,
        emailBody
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
