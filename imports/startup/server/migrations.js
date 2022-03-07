import { Meteor } from 'meteor/meteor';
import Resources from '/imports/api/resources/resource';

// Drop && Set back - authorAvatar && authorFirstName && authorLastName
Migrations.add({
  version: 1,
  up: async function() {
    console.log('up to', this.version);
    Resources.update({}, {$unset: {authorAvatar: true}}, {multi: true});
    Resources.update({}, {$unset: {authorFirstName: true}}, {multi: true});
    Resources.update({}, {$unset: {authorLastName: true}}, {multi: true});
  },
  down: async function() {
    console.log('down to', (this.version - 1));
    await Resources.find({authorId: {$exists: true}}).forEach(item => {
      const user = Meteor.users.findOne(item.authorId);
      Resources.update({_id: item._id}, {$set: {authorAvatar: user.avatar}});
      Resources.update({_id: item._id}, {$set: {authorFirstName: user.firstName}});
      Resources.update({_id: item._id}, {$set: {authorLastName: user.lastName}});
    });
  }
});
// Drop && Set back - labelLowerCase
Migrations.add({
  version: 2,
  up: async function() {
    console.log('up to', this.version);
    Resources.update({}, {$unset: {labelLowerCase: true}}, {multi: true});
  },
  down: async function() {
    console.log('down to', (this.version - 1));
    await Resources.find({_id: {$exists: true}}).forEach(item => {
      const labelLowerCase = item.label.toLowerCase();
      Resources.update(item._id, {$set: {labelLowerCase}});
    });
  }
});

// Run migrations
Meteor.startup(() => {
  Migrations.migrateTo(0);
  // Migrations.migrateTo(1);
  // Migrations.migrateTo(2);
  Migrations.migrateTo('latest');
});