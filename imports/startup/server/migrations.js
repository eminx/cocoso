import { Meteor } from 'meteor/meteor';
import Resources from '/imports/api/resources/resource';
import Hosts from '/imports/api/@hosts/host';
import Activities from '/imports/api/activities/activity';

// Drop && Set back - authorAvatar && authorFirstName && authorLastName
Migrations.add({
  version: 1,
  up: async function () {
    console.log('up to', this.version);
    Resources.update({}, { $unset: { authorAvatar: true } }, { multi: true });
    Resources.update(
      {},
      { $unset: { authorFirstName: true } },
      { multi: true }
    );
    Resources.update({}, { $unset: { authorLastName: true } }, { multi: true });
  },
  down: async function () {
    console.log('down to', this.version - 1);
    await Resources.find({ authorId: { $exists: true } }).forEach((item) => {
      const user = Meteor.users.findOne(item.authorId);
      Resources.update(
        { _id: item._id },
        { $set: { authorAvatar: user.avatar } }
      );
      Resources.update(
        { _id: item._id },
        { $set: { authorFirstName: user.firstName } }
      );
      Resources.update(
        { _id: item._id },
        { $set: { authorLastName: user.lastName } }
      );
    });
  },
});

// Drop && Set back - labelLowerCase
Migrations.add({
  version: 2,
  up: async function () {
    console.log('up to', this.version);
    Resources.update({}, { $unset: { labelLowerCase: true } }, { multi: true });
  },
  down: async function () {
    console.log('down to', this.version - 1);
    await Resources.find({ _id: { $exists: true } }).forEach((item) => {
      const labelLowerCase = item.label.toLowerCase();
      Resources.update(item._id, { $set: { labelLowerCase } });
    });
  },
});

// Change - resourcesForCombo - arrayOfObjects <=> arrayOfIds
Migrations.add({
  version: 3,
  up: async function () {
    console.log('up to', this.version);
    await Resources.find({ isCombo: true }).forEach((item) => {
      const resourcesForCombo = [];
      item.resourcesForCombo.forEach((res) => {
        resourcesForCombo.push(res._id);
      });
      Resources.update(item._id, { $set: { resourcesForCombo } });
    });
  },
  down: async function () {
    console.log('down to', this.version - 1);
    await Resources.find({ isCombo: true }).forEach((item) => {
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
  up: async function () {
    console.log('up to', this.version);
    await Resources.find({ creationDate: { $exists: true } }).forEach(
      (item) => {
        const createdAt = item.creationDate;
        Resources.update(item._id, { $set: { createdAt } });
      }
    );
    Resources.update({}, { $unset: { creationDate: true } }, { multi: true });
  },
  down: async function () {
    console.log('down to', this.version - 1);
    await Resources.find({ createdAt: { $exists: true } }).forEach((item) => {
      const creationDate = item.createdAt;
      Resources.update(item._id, { $set: { creationDate } });
    });
    Resources.update({}, { $unset: { createdAt: true } }, { multi: true });
  },
});

// Switch between - latestUpdate <=> updatedAt
Migrations.add({
  version: 5,
  up: async function () {
    console.log('up to', this.version);
    await Resources.find({ latestUpdate: { $exists: true } }).forEach(
      (item) => {
        const updatedAt = item.latestUpdate;
        Resources.update(item._id, { $set: { updatedAt } });
      }
    );
    Resources.update({}, { $unset: { latestUpdate: true } }, { multi: true });
  },
  down: async function () {
    console.log('down to', this.version - 1);
    await Resources.find({ updatedAt: { $exists: true } }).forEach((item) => {
      const latestUpdate = item.updatedAt;
      Resources.update(item._id, { $set: { latestUpdate } });
    });
    Resources.update({}, { $unset: { updatedAt: true } }, { multi: true });
  },
});

// Switch between - authorId <=> userId
Migrations.add({
  version: 6,
  up: async function () {
    console.log('up to', this.version);
    await Resources.find({ authorId: { $exists: true } }).forEach((item) => {
      const userId = item.authorId;
      Resources.update(item._id, { $set: { userId } });
    });
    Resources.update({}, { $unset: { authorId: true } }, { multi: true });
  },
  down: async function () {
    console.log('down to', this.version - 1);
    await Resources.find({ userId: { $exists: true } }).forEach((item) => {
      const authorId = item.userId;
      Resources.update(item._id, { $set: { authorId } });
    });
    Resources.update({}, { $unset: { userId: true } }, { multi: true });
  },
});

// Switch between - authorUsername <=> createdBy
Migrations.add({
  version: 7,
  up: async function () {
    console.log('up to', this.version);
    await Resources.find({ authorUsername: { $exists: true } }).forEach(
      (item) => {
        const createdBy = item.authorUsername;
        Resources.update(item._id, { $set: { createdBy } });
      }
    );
    Resources.update({}, { $unset: { authorUsername: true } }, { multi: true });
  },
  down: async function () {
    console.log('down to', this.version - 1);
    await Resources.find({ createdBy: { $exists: true } }).forEach((item) => {
      const authorUsername = item.createdBy;
      Resources.update(item._id, { $set: { authorUsername } });
    });
    Resources.update({}, { $unset: { createdBy: true } }, { multi: true });
  },
});

// Switch between - authorUsername <=> createdBy
Migrations.add({
  version: 8,
  up: async function () {
    console.log('up to', this.version);
    await Hosts.find({ 'settings.menu': { $exists: true } }).forEach((item) => {
      if (!item.settings.menu.find((item) => item?.name === 'resource')) {
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
  down: async function () {
    console.log('down to', this.version - 1);
    await Hosts.find({ 'settings.menu': { $exists: true } }).forEach((item) => {
      const menu = [];
      item.settings.menu.forEach((item) => {
        if (item?.name !== 'resources') menu.push(item);
      });
      Hosts.update(item._id, { $set: { 'settings.menu': menu } });
    });
  },
});

// Return embedding resource objects in resourcesForCombo rather than using only _ids
Migrations.add({
  version: 9,
  up: async function () {
    console.log('up to', this.version);
    await Resources.find({ isCombo: true }).forEach((item) => {
      const resourcesForCombo = Resources.find(
        { _id: { $in: item.resourcesForCombo } },
        { fields: { _id: 1, label: 1, description: 1, resourceIndex: 1 } }
      ).fetch();
      Resources.update(item._id, { $set: { resourcesForCombo } });
    })
  },
  down: async function () {
    console.log('down to', this.version - 1);
    await Resources.find({ isCombo: true }).forEach((item) => {
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
  up: async function () {
    console.log('up to', this.version);
    await Activities.find().forEach((item) => {
      Activities.update({_id: item._id}, {
        $set: {
          isExclusiveActivity: true,
        }
      });
    })
  },
  down: async function () {
    console.log('down to', this.version - 1);
    await Activities.find().forEach((item) => {
      Activities.update({_id: item._id}, {
        $unset: {
          isExclusiveActivity: 1,
        }
      });
    })
  },
});

// Run migrations
Meteor.startup(() => {
  // Migrations.migrateTo(0);
  // Migrations.migrateTo(0);
  // Migrations.migrateTo(2);
  // Migrations.migrateTo(3);
  // Migrations.migrateTo(4);
  // Migrations.migrateTo(5);
  // Migrations.migrateTo(6);
  // Migrations.migrateTo(7);
  // Migrations.migrateTo(8);
  // Migrations.migrateTo(9);
  // Migrations.migrateTo(10);
  // Migrations.migrateTo('latest');
});
