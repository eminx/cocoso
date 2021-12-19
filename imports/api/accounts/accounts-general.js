import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  user.attending = [];
  user.processes = [];
  user.notifications = [];
  user.memberships = [];

  return user;
});
