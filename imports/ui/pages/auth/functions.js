import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import i18next from 'i18next';

import { message } from '/imports/ui/generic/message';
import { call } from '../../../api/_utils/shared';
import { setupEncryption } from '/imports/utils/setupEncryption';

export const loginWithPasswordAsync = Meteor.promisify(
  Meteor.loginWithPassword
);

export async function loginWithPassword(
  username,
  password,
  isNewAccount = false
) {
  console.log('[login] loginWithPassword called for', username);
  try {
    await loginWithPasswordAsync(username, password);
    console.log('[login] loginWithPasswordAsync succeeded, userId:', Meteor.userId());
    if (isNewAccount) {
      await call('setSelfAsParticipant');
    }
    const userId = Meteor.userId();
    if (userId) {
      console.log('[login] calling setupEncryption...');
      setupEncryption(userId, password);
    } else {
      console.warn('[login] userId is null after login — setupEncryption skipped');
    }
    const translation = i18next.t('accounts:login.messages.success');
    message.success(translation);
  } catch (error) {
    console.error('[login] error:', error);
    message.error(error.reason);
  }
}

export async function createAccount(values) {
  check(values.email, String);
  check(values.username, String);
  check(values.password, String);
  try {
    await call('createAccount', values);
    await loginWithPassword(values.username, values.password, true);
  } catch (error) {
    message.error(error.error ? error.error.reason : error.reason);
  }
}
