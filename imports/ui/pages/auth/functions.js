import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import i18next from 'i18next';

import { message } from '/imports/ui/generic/message';
import { call } from '/imports/ui/utils/shared';

export const loginWithPasswordAsync = Meteor.promisify(
  Meteor.loginWithPassword
);

export async function loginWithPassword(
  username,
  password,
  isNewAccount = false
) {
  try {
    await loginWithPasswordAsync(username, password);
    if (isNewAccount) {
      await call('setSelfAsParticipant');
    }
    const translation = i18next.t('accounts:login.messages.success');
    message.success(translation);
  } catch (error) {
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
