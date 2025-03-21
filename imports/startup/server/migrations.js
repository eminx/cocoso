import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';

import Hosts from '../../api/hosts/host';
import Resources from '../../api/resources/resource';
import Activities from '../../api/activities/activity';
import Groups from '../../api/groups/group';
import Pages from '../../api/pages/page';
import Works from '../../api/works/work';

// Drop && Set back - authorAvatar && authorFirstName && authorLastName
Migrations.add({
  version: 1,
  async up() {
    console.log('up to', this.version);
    Resources.update({}, { $unset: { authorAvatar: true } }, { multi: true });
    Resources.update({}, { $unset: { authorFirstName: true } }, { multi: true });
    Resources.update({}, { $unset: { authorLastName: true } }, { multi: true });
  },
  async down() {
    console.log('down to', this.version - 1);
    Resources.find({ authorId: { $exists: true } }).forEach((item) => {
      const user = Meteor.users.findOne(item.authorId);
      Resources.update({ _id: item._id }, { $set: { authorAvatar: user.avatar } });
      Resources.update({ _id: item._id }, { $set: { authorFirstName: user.firstName } });
      Resources.update({ _id: item._id }, { $set: { authorLastName: user.lastName } });
    });
  },
});

// Drop && Set back - labelLowerCase
Migrations.add({
  version: 2,
  async up() {
    console.log('up to', this.version);
    Resources.update({}, { $unset: { labelLowerCase: true } }, { multi: true });
  },
  async down() {
    console.log('down to', this.version - 1);
    Resources.find({ _id: { $exists: true } }).forEach((item) => {
      const labelLowerCase = item.label.toLowerCase();
      Resources.update(item._id, { $set: { labelLowerCase } });
    });
  },
});

// Change - resourcesForCombo - arrayOfObjects <=> arrayOfIds
Migrations.add({
  version: 3,
  async up() {
    console.log('up to', this.version);
    Resources.find({ isCombo: true }).forEach((item) => {
      const resourcesForCombo = [];
      item.resourcesForCombo.forEach((res) => {
        resourcesForCombo.push(res._id);
      });
      Resources.update(item._id, { $set: { resourcesForCombo } });
    });
  },
  async down() {
    console.log('down to', this.version - 1);
    Resources.find({ isCombo: true }).forEach((item) => {
      const resourcesForCombo = Resources.find(
        { _id: { $in: item.resourcesForCombo } },
        { fields: { _id: 1, label: 1, description: 1, resourceIndex: 1 } }
      ).fetch();
      Resources.update(item._id, { $set: { resourcesForCombo } });
    });
  },
});

// Switch between - creationDate <=> createdAt
Migrations.add({
  version: 4,
  async up() {
    console.log('up to', this.version);
    Resources.find({ creationDate: { $exists: true } }).forEach((item) => {
      const createdAt = item.creationDate;
      Resources.update(item._id, { $set: { createdAt } });
    });
    Resources.update({}, { $unset: { creationDate: true } }, { multi: true });
  },
  async down() {
    console.log('down to', this.version - 1);
    Resources.find({ createdAt: { $exists: true } }).forEach((item) => {
      const creationDate = item.createdAt;
      Resources.update(item._id, { $set: { creationDate } });
    });
    Resources.update({}, { $unset: { createdAt: true } }, { multi: true });
  },
});

// Switch between - latestUpdate <=> updatedAt
Migrations.add({
  version: 5,
  async up() {
    console.log('up to', this.version);
    Resources.find({ latestUpdate: { $exists: true } }).forEach((item) => {
      const updatedAt = item.latestUpdate;
      Resources.update(item._id, { $set: { updatedAt } });
    });
    Resources.update({}, { $unset: { latestUpdate: true } }, { multi: true });
  },
  async down() {
    console.log('down to', this.version - 1);
    Resources.find({ updatedAt: { $exists: true } }).forEach((item) => {
      const latestUpdate = item.updatedAt;
      Resources.update(item._id, { $set: { latestUpdate } });
    });
    Resources.update({}, { $unset: { updatedAt: true } }, { multi: true });
  },
});

// Switch between - authorId <=> userId
Migrations.add({
  version: 6,
  async up() {
    console.log('up to', this.version);
    Resources.find({ authorId: { $exists: true } }).forEach((item) => {
      const userId = item.authorId;
      Resources.update(item._id, { $set: { userId } });
    });
    Resources.update({}, { $unset: { authorId: true } }, { multi: true });
  },
  async down() {
    console.log('down to', this.version - 1);
    Resources.find({ userId: { $exists: true } }).forEach((item) => {
      const authorId = item.userId;
      Resources.update(item._id, { $set: { authorId } });
    });
    Resources.update({}, { $unset: { userId: true } }, { multi: true });
  },
});

// Switch between - authorUsername <=> createdBy
Migrations.add({
  version: 7,
  async up() {
    console.log('up to', this.version);
    Resources.find({ authorUsername: { $exists: true } }).forEach((item) => {
      const createdBy = item.authorUsername;
      Resources.update(item._id, { $set: { createdBy } });
    });
    Resources.update({}, { $unset: { authorUsername: true } }, { multi: true });
  },
  async down() {
    console.log('down to', this.version - 1);
    Resources.find({ createdBy: { $exists: true } }).forEach((item) => {
      const authorUsername = item.createdBy;
      Resources.update(item._id, { $set: { authorUsername } });
    });
    Resources.update({}, { $unset: { createdBy: true } }, { multi: true });
  },
});

// Switch between - authorUsername <=> createdBy
Migrations.add({
  version: 8,
  async up() {
    console.log('up to', this.version);
    Hosts.find({ 'settings.menu': { $exists: true } }).forEach((item) => {
      if (!item.settings.menu.find((menuItem) => menuItem?.name === 'resource')) {
        const menu = [
          ...item.settings.menu,
          {
            label: 'Resources',
            name: 'resources',
            isVisible: false,
            isHomePage: false,
          },
        ];
        Hosts.update(item._id, { $set: { 'settings.menu': menu } });
      }
    });
  },
  async down() {
    console.log('down to', this.version - 1);
    Hosts.find({ 'settings.menu': { $exists: true } }).forEach((item) => {
      const menu = [];
      item.settings.menu.forEach((menuItem) => {
        if (menuItem.name !== 'resources') {
          menu.push(item);
        }
      });
      Hosts.update(item._id, { $set: { 'settings.menu': menu } });
    });
  },
});

// Return embedding resource objects in resourcesForCombo rather than using only _ids
Migrations.add({
  version: 9,
  async up() {
    console.log('up to', this.version);
    Resources.find({ isCombo: true }).forEach((item) => {
      const resourcesForCombo = Resources.find(
        { _id: { $in: item.resourcesForCombo } },
        { fields: { _id: 1, label: 1, description: 1, resourceIndex: 1 } }
      ).fetch();
      Resources.update(item._id, { $set: { resourcesForCombo } });
    });
  },
  async down() {
    console.log('down to', this.version - 1);
    Resources.find({ isCombo: true }).forEach((item) => {
      const resourcesForCombo = [];
      item.resourcesForCombo.forEach((res) => {
        resourcesForCombo.push(res?._id);
      });
      Resources.update(item._id, { $set: { resourcesForCombo } });
    });
  },
});

// Add exclusive switch to all activities
Migrations.add({
  version: 10,
  async up() {
    console.log('up to', this.version);
    Activities.find().forEach((item) => {
      Activities.update(
        { _id: item._id },
        {
          $set: {
            isExclusiveActivity: true,
          },
        }
      );
    });
  },
  async down() {
    console.log('down to', this.version - 1);
    Activities.find().forEach((item) => {
      Activities.update(
        { _id: item._id },
        {
          $unset: {
            isExclusiveActivity: 1,
          },
        }
      );
    });
  },
});

// Create Activity from each Group Meeting (with a Resource)
Migrations.add({
  version: 11,
  async up() {
    console.log('up to', this.version);
    Groups.find({ meetings: { $exists: true } }).forEach(async (group) => {
      await group.meetings.forEach(async (meeting, meetingIndex) => {
        const newAttendees = [];
        await meeting.attendees.forEach((attendee) => {
          const theUser = Meteor.users.findOne(attendee.memberId);
          const theAttendee = {
            email: theUser.emails[0].address,
            username: theUser.username,
            firstName: theUser.firstName || '',
            lastName: theUser.lastName || '',
            numberOfPeople: 1,
            registerDate: attendee.confirmDate,
          };
          newAttendees.push(theAttendee);
        });
        let newActivity = {
          host: group.host,
          authorId: group.adminId,
          authorName: group.adminUsername,
          title: group.title,
          longDescription: group.description,
          datesAndTimes: [
            {
              startDate: meeting.startDate,
              endDate: meeting.startDate,
              startTime: meeting.startTime,
              endTime: meeting.endTime,
              attendees: [...newAttendees],
            },
          ],
          groupId: group._id,
          isPublicActivity: false,
          isRegistrationDisabled: true,
          isGroupMeeting: true,
          isSentForReview: group.isSentForReview || false,
          isPublished: group.isPublished,
          creationDate: group.creationDate,
        };
        try {
          const theResource = Resources.findOne({ label: meeting.resource });
          if (theResource) {
            newActivity = {
              ...newActivity,
              resource: theResource.label || '',
              resourceId: theResource._id || '',
            };
          }
        } catch (error) {
          console.error(error);
        }
        Activities.insert({ ...newActivity });
      });
    });
  },
  async down() {
    console.log('down to', this.version - 1);
    // one way single migration
  },
});

// Clean all nested Meeting arrays from Groups
Migrations.add({
  version: 12,
  async up() {
    console.log('up to', this.version);
    Groups.find({ meetings: { $exists: true } }).forEach((group) => {
      Groups.update({ _id: group._id }, { $unset: { meetings: 1 } });
    });
  },
  async down() {
    console.log('down to', this.version - 1);
    // one way single migration
  },
});

Migrations.add({
  version: 13,
  async up() {
    console.log('up to', this.version);
  },
  async down() {
    console.log('down to', this.version - 1);
    Hosts.find().forEach((host) => {
      Pages.remove({
        host: host.host,
        isTermsPage: true,
      });
    });
  },
});

Migrations.add({
  version: 14,
  async up() {
    console.log('up to', this.version);
    Groups.find().forEach((group) => {
      const admin = Meteor.users.findOne({ _id: group.adminId });
      const members = group.members;
      const newMembers = members.map((m) => {
        const member = Meteor.users.findOne({ _id: m.memberId });
        return {
          memberId: m.memberId,
          username: m.username,
          joinDate: m.joinDate,
          avatar: member?.avatar?.src,
          isAdmin: group.adminId === m.memberId,
        };
      });
      Groups.update(
        { _id: group._id },
        {
          $set: {
            authorId: group.adminId,
            authorUsername: group.adminUsername,
            authorAvatar: admin?.avatar?.src,
            members: newMembers,
          },
          $unset: {
            adminId: 1,
            adminUsername: 1,
          },
        }
      );
    });

    Works.find().forEach(function (work) {
      const user = Meteor.users.findOne({ _id: work.authorId });
      const userAvatar = user && user.avatar ? user.avatar.src : '';
      Works.update(
        { _id: work._id },
        {
          $set: {
            authorAvatar: userAvatar,
          },
        }
      );
    });
  },
  async down() {
    console.log('down to', this.version - 1);
    Groups.find().forEach((group) => {
      const members = group.members;
      const oldMembers = members.map((m) => ({
        memberId: m.memberId,
        username: m.username,
        joinDate: m.joinDate,
        profileImage: m.avatar,
      }));
      const admin = group.members.find((m) => m.isAdmin);
      Groups.update(
        { _id: group._id },
        {
          $set: {
            members: oldMembers,
            adminId: admin?.memberId,
            adminUsername: admin?.username,
          },
          $unset: {
            authorId: 1,
            authorUsername: 1,
          },
        }
      );
    });

    Works.find().forEach((work) => {
      const user = Meteor.users.findOne({ _id: work.authorId });
      const userAvatar = user ? user.avatar : null;
      Works.update(
        {
          _id: work._id,
        },
        {
          $set: {
            authorAvatar: userAvatar,
          },
        }
      );
    });
  },
});

Migrations.add({
  version: 15,
  async up() {
    console.log('up to', this.version);
  },
  async down() {
    console.log('down to', this.version - 1);
  },
});

Migrations.add({
  version: 16,
  async up() {
    console.log('up to', this.version);
    Meteor.users.update(
      {},
      {
        $set: { isPublic: true },
      },
      { multi: true }
    );

    Hosts.find().forEach((host) => {
      const members = host.members;
      const membersAltered = members.map((m) => ({
        ...m,
        isPublic: true,
      }));
      Hosts.update(
        { _id: host._id },
        {
          $set: {
            members: membersAltered,
          },
        }
      );
    });
  },
  async down() {
    console.log('down to', this.version - 1);
    Meteor.users.update(
      {},
      {
        $unset: { isPublic: true },
      },
      { multi: true }
    );
    Hosts.find().forEach((host) => {
      const members = host.members;
      const membersAltered = members.map((m) => {
        delete m.isPublic;
        return m;
      });
      Hosts.update(
        { _id: host._id },
        {
          $set: {
            members: membersAltered,
          },
        }
      );
    });
  },
});

Migrations.add({
  version: 17,
  async up() {
    console.log('up to', this.version);
    Resources.update(
      {},
      {
        $set: {
          isBookable: true,
        },
      },
      { multi: true }
    );
  },
  async down() {
    console.log('down to', this.version - 1);
    Resources.update(
      {},
      {
        $unset: {
          isBookable: 1,
        },
      },
      { multi: true }
    );
  },
});

// Run migrations
Meteor.startup(() => {
  // Migrations.migrateTo(0);
  // Migrations.migrateTo(1);
  // Migrations.migrateTo(2);
  // Migrations.migrateTo(3);
  // Migrations.migrateTo(4);
  // Migrations.migrateTo(5);
  // Migrations.migrateTo(6);
  // Migrations.migrateTo(7);
  // Migrations.migrateTo(8);
  // Migrations.migrateTo(9);
  // Migrations.migrateTo(10);
  // Migrations.migrateTo(11);
  // Migrations.migrateTo(12);
  // Migrations.migrateTo(13);
  // Migrations.migrateTo(14);
  // Migrations.migrateTo(15);
  // Migrations.migrateTo(16);
  // Migrations.migrateTo(17);
  // Migrations.migrateTo('latest');
});
