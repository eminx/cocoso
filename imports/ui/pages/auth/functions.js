import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { useTranslation } from 'react-i18next';
import { message } from '../../components/message';
import { call } from '../../utils/shared';

function loginWithPassword(username, password, isNewAccount) {
  const [t] = useTranslation('accounts');

  Meteor.loginWithPassword(username, password, (error) => {
    if (error) {
      console.log(error);
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
    message.success(t('login.messages.success'));
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
