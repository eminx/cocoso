import { Meteor } from 'meteor/meteor';
import { message } from '../UIComponents/message';
import { call } from '../functions';

async function createAccount(values) {
  check(values.email, String);
  check(values.username, String);
  check(values.password, String);
  try {
    const userId = await call('createAccount', values);
    loginWithPassword(values.username, values.password, true);
  } catch (error) {
    message.error(error.error ? error.error.reason : error.reason);
  }
}

function loginWithPassword(username, password, isNewAccount) {
  Meteor.loginWithPassword(username, password, (error, respond) => {
    if (error) {
      console.log(error);
      message.error(error.reason);
      return;
    }
    if (isNewAccount) {
      Meteor.call('setSelfAsParticipant', (error, respond) => {
        if (error) {
          console.log(error);
        }
      });
    }
    message.success('You are successfully logged in');
  });
}

export { createAccount, loginWithPassword };
