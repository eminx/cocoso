import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { message } from '../../components/message';
import { call } from '../../utils/shared';

function loginWithPassword(username, password, isNewAccount) {
  Meteor.loginWithPassword(username, password, (error) => {
    if (error) {
      message.error(error.reason);
      return;
    }
    if (isNewAccount) {
      Meteor.call('setSelfAsParticipant', (error2) => {
        if (error2) {
          message.error(error2.reason);
          console.log(error2);
        }
      });
    }
    message.success('You are successfully logged in');
  });
}

async function createAccount(values) {
  check(values.email, String);
  check(values.username, String);
  check(values.password, String);
  try {
    await call('createAccount', values);
    loginWithPassword(values.username, values.password, true);
  } catch (error) {
    message.error(error.error ? error.error.reason : error.reason);
  }
}

export { createAccount, loginWithPassword };
