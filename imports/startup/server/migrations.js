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
    await Resources.updateAsync(
      {},
      { $unset: { authorAvatar: true } },
      { multi: true }
    );
    await Resources.updateAsync(
      {},
      { $unset: { authorFirstName: true } },
      { multi: true }
    );
    await Resources.updateAsync(
      {},
      { $unset: { authorLastName: true } },
      { multi: true }
    );
  },
  async down() {
    console.log('down to', this.version - 1);
    await Resources.find({ authorId: { $exists: true } }).forEachAsync(
      async (item) => {
        const user = await Meteor.users.findOneAsync(item.authorId);
        await Resources.updateAsync(
          { _id: item._id },
          { $set: { authorAvatar: user.avatar } }
        );
        await Resources.updateAsync(
          { _id: item._id },
          { $set: { authorFirstName: user.firstName } }
        );
        await Resources.updateAsync(
          { _id: item._id },
          { $set: { authorLastName: user.lastName } }
        );
      }
    );
  },
});

// Drop && Set back - labelLowerCase
Migrations.add({
  version: 2,
  async up() {
    console.log('up to', this.version);
    await Resources.updateAsync(
      {},
      { $unset: { labelLowerCase: true } },
      { multi: true }
    );
  },
  async down() {
    console.log('down to', this.version - 1);
    await Resources.find({ _id: { $exists: true } }).forEachAsync(
      async (item) => {
        const labelLowerCase = item.label.toLowerCase();
        await Resources.updateAsync(item._id, { $set: { labelLowerCase } });
      }
    );
  },
});

// Change - resourcesForCombo - arrayOfObjects <=> arrayOfIds
Migrations.add({
  version: 3,
  async up() {
    console.log('up to', this.version);
    await Resources.find({ isCombo: true }).forEachAsync(async (item) => {
      const resourcesForCombo = [];
      item.resourcesForCombo.forEach((res) => {
        resourcesForCombo.push(res._id);
      });
      await Resources.updateAsync(item._id, { $set: { resourcesForCombo } });
    });
  },
  async down() {
    console.log('down to', this.version - 1);
    await Resources.find({ isCombo: true }).forEachAsync(async (item) => {
      const resourcesForCombo = Resources.find(
        { _id: { $in: item.resourcesForCombo } },
        { fields: { _id: 1, label: 1, description: 1, resourceIndex: 1 } }
      ).fetchAsync();
      await Resources.updateAsync(item._id, { $set: { resourcesForCombo } });
    });
  },
});

// Switch between - creationDate <=> createdAt
Migrations.add({
  version: 4,
  async up() {
    console.log('up to', this.version);
    await Resources.find({ creationDate: { $exists: true } }).forEachAsync(
      async (item) => {
        const createdAt = item.creationDate;
        await Resources.updateAsync(item._id, { $set: { createdAt } });
      }
    );
    await Resources.updateAsync(
      {},
      { $unset: { creationDate: true } },
      { multi: true }
    );
  },
  async down() {
    console.log('down to', this.version - 1);
    await Resources.find({ createdAt: { $exists: true } }).forEachAsync(
      async (item) => {
        const creationDate = item.createdAt;
        await Resources.updateAsync(item._id, { $set: { creationDate } });
      }
    );
    await Resources.updateAsync(
      {},
      { $unset: { createdAt: true } },
      { multi: true }
    );
  },
});

// Switch between - latestUpdate <=> updatedAt
Migrations.add({
  version: 5,
  async up() {
    console.log('up to', this.version);
    await Resources.find({ latestUpdate: { $exists: true } }).forEachAsync(
      async (item) => {
        const updatedAt = item.latestUpdate;
        await Resources.updateAsync(item._id, { $set: { updatedAt } });
      }
    );
    await Resources.updateAsync(
      {},
      { $unset: { latestUpdate: true } },
      { multi: true }
    );
  },
  async down() {
    console.log('down to', this.version - 1);
    await Resources.find({ updatedAt: { $exists: true } }).forEachAsync(
      async (item) => {
        const latestUpdate = item.updatedAt;
        await Resources.updateAsync(item._id, { $set: { latestUpdate } });
      }
    );
    await Resources.updateAsync(
      {},
      { $unset: { updatedAt: true } },
      { multi: true }
    );
  },
});

// Switch between - authorId <=> userId
Migrations.add({
  version: 6,
  async up() {
    console.log('up to', this.version);
    await Resources.find({ authorId: { $exists: true } }).forEachAsync(
      async (item) => {
        const userId = item.authorId;
        await Resources.updateAsync(item._id, { $set: { userId } });
      }
    );
    await Resources.updateAsync(
      {},
      { $unset: { authorId: true } },
      { multi: true }
    );
  },
  async down() {
    console.log('down to', this.version - 1);
    await Resources.find({ userId: { $exists: true } }).forEachAsync(
      async (item) => {
        const authorId = item.userId;
        await Resources.updateAsync(item._id, { $set: { authorId } });
      }
    );
    await Resources.updateAsync(
      {},
      { $unset: { userId: true } },
      { multi: true }
    );
  },
});

// Switch between - authorUsername <=> createdBy
Migrations.add({
  version: 7,
  async up() {
    console.log('up to', this.version);
    await Resources.find({ authorUsername: { $exists: true } }).forEachAsync(
      async (item) => {
        const createdBy = item.authorUsername;
        await Resources.updateAsync(item._id, { $set: { createdBy } });
      }
    );
    await Resources.updateAsync(
      {},
      { $unset: { authorUsername: true } },
      { multi: true }
    );
  },
  async down() {
    console.log('down to', this.version - 1);
    await Resources.find({ createdBy: { $exists: true } }).forEachAsync(
      async (item) => {
        const authorUsername = item.createdBy;
        await Resources.updateAsync(item._id, { $set: { authorUsername } });
      }
    );
    await Resources.updateAsync(
      {},
      { $unset: { createdBy: true } },
      { multi: true }
    );
  },
});

// Switch between - authorUsername <=> createdBy
Migrations.add({
  version: 8,
  async up() {
    console.log('up to', this.version);
    await Hosts.find({ 'settings.menu': { $exists: true } }).forEachAsync(
      async (item) => {
        if (
          !item.settings.menu.find((menuItem) => menuItem?.name === 'resource')
        ) {
          const menu = [
            ...item.settings.menu,
            {
              label: 'Resources',
              name: 'resources',
              isVisible: false,
              isHomePage: false,
            },
          ];
          await Hosts.updateAsync(item._id, {
            $set: { 'settings.menu': menu },
          });
        }
      }
    );
  },
  async down() {
    console.log('down to', this.version - 1);
    await Hosts.find({ 'settings.menu': { $exists: true } }).forEachAsync(
      async (item) => {
        const menu = [];
        item.settings.menu.forEach((menuItem) => {
          if (menuItem.name !== 'resources') {
            menu.push(item);
          }
        });
        await Hosts.updateAsync(item._id, { $set: { 'settings.menu': menu } });
      }
    );
  },
});

// Return embedding resource objects in resourcesForCombo rather than using only _ids
Migrations.add({
  version: 9,
  async up() {
    console.log('up to', this.version);
    await Resources.find({ isCombo: true }).forEachAsync(async (item) => {
      const resourcesForCombo = await Resources.find(
        { _id: { $in: item.resourcesForCombo } },
        { fields: { _id: 1, label: 1, description: 1, resourceIndex: 1 } }
      ).fetchAsync();
      await Resources.updateAsync(item._id, { $set: { resourcesForCombo } });
    });
  },
  async down() {
    console.log('down to', this.version - 1);
    await Resources.find({ isCombo: true }).forEachAsync(async (item) => {
      const resourcesForCombo = [];
      item.resourcesForCombo.forEach((res) => {
        resourcesForCombo.push(res?._id);
      });
      await Resources.updateAsync(item._id, { $set: { resourcesForCombo } });
    });
  },
});

// Add exclusive switch to all activities
Migrations.add({
  version: 10,
  async up() {
    console.log('up to', this.version);
    await Activities.find().forEachAsync(async (item) => {
      await Activities.updateAsync(
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
    await Activities.find().forEachAsync(async (item) => {
      await Activities.updateAsync(
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
    await Groups.find({ meetings: { $exists: true } }).forEachAsync(
      async (group) => {
        await group.meetings.forEach(async (meeting, meetingIndex) => {
          const newAttendees = [];
          await meeting.attendees.forEach((attendee) => {
            const theUser = Meteor.users.findOneAsync(attendee.memberId);
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
            const theResource = await Resources.findOneAsync({
              label: meeting.resource,
            });
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
          await Activities.insertAsync({ ...newActivity });
        });
      }
    );
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
    await Groups.find({ meetings: { $exists: true } }).forEachAsync(
      async (group) => {
        await Groups.updateAsync(
          { _id: group._id },
          { $unset: { meetings: 1 } }
        );
      }
    );
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
    await Hosts.find().forEachAsync(async (host) => {
      await Pages.removeAsync({
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
    await Groups.find().forEachAsync(async (group) => {
      const admin = await Meteor.users.findOneAsync({ _id: group.adminId });
      const members = group.members;
      const newMembers = members.map(async (m) => {
        const member = await Meteor.users.findOneAsync({ _id: m.memberId });
        return {
          memberId: m.memberId,
          username: m.username,
          joinDate: m.joinDate,
          avatar: member?.avatar?.src,
          isAdmin: group.adminId === m.memberId,
        };
      });
      await Groups.updateAsync(
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

    await Works.find().forEachAsync(async function (work) {
      const user = await Meteor.users.findOneAsync({ _id: work.authorId });
      const userAvatar = user && user.avatar ? user.avatar.src : '';
      await Works.updateAsync(
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
    await Groups.find().forEachAsync(async (group) => {
      const members = group.members;
      const oldMembers = members.map((m) => ({
        memberId: m.memberId,
        username: m.username,
        joinDate: m.joinDate,
        profileImage: m.avatar,
      }));
      const admin = group.members.find((m) => m.isAdmin);
      await Groups.updateAsync(
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

    await Works.find().forEachAsync(async (work) => {
      const user = await Meteor.users.findOneAsync({ _id: work.authorId });
      const userAvatar = user ? user.avatar : null;
      await Works.updateAsync(
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
    await Meteor.users.updateAsync(
      {},
      {
        $set: { isPublic: true },
      },
      { multi: true }
    );

    await Hosts.find().forEachAsync(async (host) => {
      const members = host.members;
      const membersAltered = members.map((m) => ({
        ...m,
        isPublic: true,
      }));
      await Hosts.updateAsync(
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
    await Meteor.users.updateAsync(
      {},
      {
        $unset: { isPublic: true },
      },
      { multi: true }
    );
    await Hosts.find().forEachAsync(async (host) => {
      const members = host.members;
      const membersAltered = members.map((m) => {
        delete m.isPublic;
        return m;
      });
      await Hosts.updateAsync(
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
    await Resources.updateAsync(
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
    await Resources.updateAsync(
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
