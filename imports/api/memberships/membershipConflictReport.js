import { Mongo } from 'meteor/mongo';

// Plain, unschemad collection: a disposable snapshot written fresh by every
// membershipMigration_dryRun run. Not part of the app's steady-state data
// model, so it deliberately has no SimpleSchema attached.
const MembershipConflictReports = new Mongo.Collection('membershipConflictReports');

export default MembershipConflictReports;
