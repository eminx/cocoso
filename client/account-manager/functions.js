import { Meteor } from 'meteor/meteor';
import { message } from '../UIComponents/message';
import { call } from '../functions';

async function createAccount(values) {
  check(values.email, String);
  check(values.username, String);
  check(values.password, String);

  try {
    await call('createAccount', values);
    loginWithPassword(values.username, values.password, true);
  } catch (error) {
    console.log(error);
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
    console.log('success');
    if (isNewAccount) {
      message.success('Your account is successfully created');
    } else {
      console.log('success no old account');
      message.success('You are successfully logged in');
    }
  });
}

export { createAccount, loginWithPassword };
