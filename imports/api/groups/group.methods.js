import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getHost } from '../_utils/shared';
import { isAdmin, isContributorOrAdmin, isMember } from '../users/user.roles';
import Hosts from '../hosts/host';
import Groups from './group';
import Activities from '../activities/activity';
import Platform from '../platform/platform';
import {
  getGroupRegistrationEmailBody,
  getInviteToPrivateGroupEmailBody,
} from './group.mails';
import {
  compareDatesWithStartDateForSort,
  parseGroupsWithMeetings,
} from '../../ui/utils/shared';

const publicSettings = Meteor.settings.public;

const isUserGroupAdmin = (group, userId) => {
  if (!group || !userId) {
    return false;
  }
  return group.members.some(
    (member) => member.memberId === userId && member.isAdmin
  );
};

Meteor.methods({
  async getGroup(groupId) {
    check(groupId, String);
    const group = await Groups.findOneAsync({
      _id: groupId,
    });
    if (!group) {
      throw new Meteor.Error('Group not found');
    }

    if (group.isPrivate) {
      const currentUser = await Meteor.userAsync();
      const currentUserId = currentUser._id;
      if (!currentUser) {
        return null;
      }
      if (
        group.adminId !== currentUserId &&
        !group.members.some((member) => member.memberId === currentUserId) &&
        !group.peopleInvited.some(
          (person) => person.email === currentUser.emails[0]?.address
        )
      ) {
        return null;
      }
    }
    return group;
  },

  async getGroupWithMeetings(groupId) {
    check(groupId, String);

    const group = await Groups.findOneAsync({
      _id: groupId,
    });

    if (group && group.isPrivate) {
      const currentUser = await Meteor.userAsync();
      if (!currentUser) {
        return null;
      }

      const currentUserId = currentUser._id;
      if (
        group.adminId !== currentUserId &&
        !group.members?.some((member) => member.memberId === currentUserId) &&
        !group.peopleInvited?.some(
          (person) => person.email === currentUser.emails[0]?.address
        )
      ) {
        return null;
      }
    }

    const groupActivities = await Meteor.callAsync(
      'getGroupMeetingsFuture',
      groupId
    );

    return {
      ...group,
      meetings: groupActivities
        .map((a) => ({
          ...a.datesAndTimes[0],
          meetingId: a._id,
        }))
        .sort(compareDatesWithStartDateForSort),
    };
  },

  async getGroupsWithMeetings(isPortalHost = false, hostPredefined) {
    const host = hostPredefined || getHost(this);

    try {
      const retrievedGroups = await Meteor.callAsync(
        'getGroups',
        isPortalHost,
        host
      );
      const allGroupActivities = await Meteor.callAsync(
        'getAllGroupMeetingsFuture',
        isPortalHost,
        host
      );
      const parsedGroups = parseGroupsWithMeetings(
        retrievedGroups,
        allGroupActivities
      );
      return parsedGroups;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async getGroups(isPortalHost = false, hostPredefined) {
    const user = await Meteor.userAsync();
    const host = hostPredefined || getHost(this);

    const allGroups = isPortalHost
      ? await Groups.find({}, { sort: { creationDate: -1 } }).fetchAsync()
      : await Groups.find({ host }).fetchAsync();
    const groupsFiltered = allGroups.filter((group) => {
      if (!group.isPrivate) {
        return true;
      }
      if (!user) {
        return false;
      }
      const userId = user._id;
      return (
        group.adminId === userId ||
        group.members.some((member) => member.memberId === userId) ||
        group.peopleInvited.some(
          (person) => person.email === user.emails[0].address
        )
      );
    });

    return groupsFiltered.map((group) => ({
      _id: group._id,
      title: group.title,
      readingMaterial: group.readingMaterial,
      description: group.description,
      imageUrl: group.imageUrl,
      meetings: group.meetings,
      host: group.host,
      adminUsername: group.adminUsername,
      isArchived: group.isArchived,
      members: group.members,
      creationDate: group.creationDate,
      isPrivate: group.isPrivate,
      peopleInvited: group.peopleInvited,
    }));
  },

  async getAllGroupMeetingsFuture(isPortalHost = false, hostPredefined) {
    const host = hostPredefined || getHost(this);

    const dateNow = new Date().toISOString().substring(0, 10);

    try {
      if (isPortalHost) {
        return await Activities.find({
          isGroupMeeting: true,
          'datesAndTimes.startDate': { $gte: dateNow },
        }).fetchAsync();
      }
      return await Activities.find({
        host,
        isGroupMeeting: true,
        'datesAndTimes.startDate': { $gte: dateNow },
      }).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch data");
    }
  },

  async getGroupMeetingsFuture(groupId) {
    check(groupId, String);

    const dateNow = new Date().toISOString().substring(0, 10);
    return await Activities.find({
      groupId,
      isGroupMeeting: true,
      'datesAndTimes.startDate': { $gte: dateNow },
      datesAndTimes: { $exists: true, $ne: [] },
    }).fetchAsync();
  },

  async getGroupsByUser(username) {
    if (!username) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = getHost(this);
    const platform = await Platform.findOneAsync();

    try {
      if (platform?.isFederationLayout) {
        return await Groups.find({
          isPrivate: { $ne: true },
          isArchived: { $ne: true },
          $or: [{ authorUsername: username }, { 'members.username': username }],
        }).fetchAsync();
      }
      return await Groups.find({
        isPrivate: { $ne: true },
        isArchived: { $ne: true },
        $or: [{ authorUsername: username }, { 'members.username': username }],
        host,
      }).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't fetch groups");
    }
  },

  async createGroup(formValues) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const userAvatar = user.avatar ? user.avatar.src : null;

    try {
      const newGroupId = await Groups.insertAsync({
        ...formValues,
        host,
        authorId: user._id,
        authorUsername: user.username,
        authorAvatar: userAvatar,
        documents: [],
        isPublished: true,
        members: [
          {
            avatar: userAvatar,
            joinDate: new Date(),
            isAdmin: true,
            memberId: user._id,
            username: user.username,
          },
        ],
        creationDate: new Date(),
      });

      await Meteor.callAsync(
        'createChat',
        formValues.title,
        newGroupId,
        'groups'
      );

      await Meteor.users.updateAsync(user._id, {
        $addToSet: {
          groups: {
            groupId: newGroupId,
            name: formValues.title,
            joinDate: new Date(),
            isAdmin: true,
          },
        },
      });
      return newGroupId;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't add group to the collection");
    }
  },

  async updateGroup(groupId, values) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theGroup = await Groups.findOneAsync(groupId);
    if (!isUserGroupAdmin(theGroup, user._id)) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      await Groups.updateAsync(groupId, {
        $set: {
          ...values,
        },
      });

      await Activities.updateAsync(
        {
          groupId,
        },
        {
          $set: {
            title: values.title,
            longDescription: values.description,
            images: [values.imageUrl],
          },
        },
        {
          multi: true,
        }
      );
      return groupId;
    } catch (e) {
      throw new Meteor.Error(e, "Couldn't update the group");
    }
  },

  async deleteGroup(groupId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const groupToDelete = await Groups.findOneAsync(groupId);

    if (!isUserGroupAdmin(groupToDelete, user._id)) {
      throw new Meteor.Error('You are not allowed!');
    }

    try {
      await Groups.removeAsync(groupId);
      return true;
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },

  async joinGroup(groupId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isMember(user, currentHost)) {
      throw new Meteor.Error('Please join the community first!');
    }

    const theGroup = await Groups.findOneAsync(groupId);
    const alreadyMember = theGroup.members.some((m) => m.memberId === user._id);
    if (alreadyMember) {
      throw new Meteor.Error('You are already a member');
    }

    const currentHostName = currentHost?.settings?.name;
    const userAvatar = user.avatar ? user.avatar.src : null;
    const emailBody = getGroupRegistrationEmailBody(
      theGroup,
      currentHost,
      user
    );

    try {
      await Groups.updateAsync(theGroup._id, {
        $addToSet: {
          members: {
            memberId: user._id,
            username: user.username,
            avatar: userAvatar,
            joinDate: new Date(),
          },
        },
      });

      await Meteor.users.updateAsync(user._id, {
        $addToSet: {
          groups: {
            groupId: theGroup._id,
            name: theGroup.title,
            joinDate: new Date(),
          },
        },
      });

      await Meteor.callAsync(
        'sendEmail',
        user._id,
        `"${theGroup.title}", ${currentHostName}`,
        emailBody
      );
    } catch (error) {
      throw new Meteor.Error(error, 'Could not join the circle');
    }
  },

  async leaveGroup(groupId) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    const theGroup = await Groups.findOneAsync(groupId);
    const currentHostName = currentHost?.settings?.name;

    const emailBody = getGroupRegistrationEmailBody(
      theGroup,
      currentHost,
      user,
      true
    );
    try {
      await Groups.updateAsync(theGroup._id, {
        $pull: {
          members: {
            memberId: user._id,
          },
        },
      });
      await Meteor.users.updateAsync(user._id, {
        $pull: {
          groups: {
            groupId,
          },
        },
      });
      await Meteor.callAsync(
        'sendEmail',
        user._id,
        `"${theGroup.title}", ${currentHostName || publicSettings.name}`,
        emailBody
      );
    } catch (error) {
      throw new Meteor.Error('Could not leave the group');
    }
  },

  async addGroupDocument(document, groupId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theGroup = await Groups.findOneAsync(groupId);
    if (!isUserGroupAdmin(theGroup, user._id)) {
      throw new Meteor.Error('You are not admin!');
    }

    try {
      await Groups.updateAsync(groupId, {
        $push: {
          documents: document,
        },
      });
    } catch (error) {
      throw new Meteor.Error('Could not add document due to:', error.reason);
    }
  },

  async removeGroupDocument(documentName, groupId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theGroup = await Groups.findOneAsync(groupId);
    if (!isUserGroupAdmin(theGroup, user._id)) {
      throw new Meteor.Error('You are not admin!');
    }

    const newDocuments = theGroup.documents.filter(
      (document) => document.name !== documentName
    );

    try {
      await Groups.updateAsync(groupId, {
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

  async setAsAGroupAdmin(groupId, newAdminUsername) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theGroup = await Groups.findOneAsync(groupId);
    if (!isUserGroupAdmin(theGroup, user._id)) {
      throw new Meteor.Error('You are not admin!');
    }

    const newAdmin = await Meteor.users.findOneAsync({
      username: newAdminUsername,
    });

    if (!isContributorOrAdmin(newAdmin, currentHost)) {
      throw new Meteor.Error(
        'Admins must either have a cocreator or admin role in the space'
      );
    }

    const newMembers = theGroup.members.map((member) => {
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
      await Groups.updateAsync(groupId, {
        $set: {
          members: newMembers,
        },
      });
    } catch (error) {
      throw new Meteor.Error('Could not change admin due to :', error.reason);
    }
  },

  async archiveGroup(groupId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theGroup = await Groups.findOneAsync(groupId);
    if (!isUserGroupAdmin(theGroup, user._id)) {
      throw new Meteor.Error('You do not have admin privileges!');
    }

    try {
      await Groups.updateAsync(groupId, {
        $set: {
          isArchived: true,
        },
      });
    } catch (error) {
      throw new Meteor.Error('Could not archive the group', error);
    }
  },

  async unarchiveGroup(groupId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theGroup = await Groups.findOneAsync(groupId);
    if (!isUserGroupAdmin(theGroup, user._id)) {
      throw new Meteor.Error('You are not admin!');
    }

    try {
      await Groups.updateAsync(groupId, {
        $set: {
          isArchived: false,
        },
      });
    } catch (error) {
      throw new Meteor.Error('Could not unarchive the group', error);
    }
  },

  async invitePersonToPrivateGroup(groupId, person) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theGroup = await Groups.findOneAsync(groupId);
    if (!isUserGroupAdmin(theGroup, user._id)) {
      throw new Meteor.Error('You are not admin!');
    }

    if (!theGroup.isPrivate) {
      throw new Meteor.Error('This group is not private');
    }

    const invitedEmailsList = theGroup.peopleInvited.map((p) => p.email);

    if (invitedEmailsList.indexOf(person.email) !== -1) {
      throw new Meteor.Error('This email address is already added to the list');
    }

    const currentHostName = currentHost.settings?.name;
    const emailBody = getInviteToPrivateGroupEmailBody(
      theGroup,
      currentHost,
      user,
      person
    );

    try {
      await Groups.updateAsync(groupId, {
        $addToSet: {
          peopleInvited: {
            email: person.email,
            firstName: person.firstName,
          },
        },
      });

      await Meteor.callAsync(
        'sendEmail',
        person.email,
        `"${theGroup.title}", ${currentHostName}`,
        emailBody
      );
    } catch (error) {
      throw new Meteor.Error(error, 'Could not send the invite to the person');
    }
  },

  async removePersonFromInvitedList(groupId, person) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theGroup = await Groups.findOneAsync(groupId);
    if (!isUserGroupAdmin(theGroup, user._id)) {
      throw new Meteor.Error('You are not admin!');
    }

    if (!theGroup.isPrivate) {
      throw new Meteor.Error('This group is not private');
    }

    const invitedEmailsList = theGroup.peopleInvited.map((p) => p.email);

    if (invitedEmailsList.indexOf(person.email) === -1) {
      throw new Meteor.Error('The invite is not found');
    }

    try {
      await Groups.updateAsync(groupId, {
        $pull: {
          peopleInvited: {
            email: person.email,
            firstName: person.firstName,
          },
        },
      });
    } catch (error) {
      throw new Meteor.Error(error, 'Could not remove the invite');
    }
  },
});
