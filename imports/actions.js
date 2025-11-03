import { call } from '/imports/ui/utils/shared';
import { message } from '/imports/ui/generic/message';

export async function updateHostSettings({ values }) {
  try {
    await call('updateHostSettings', values);
    message.success(tc('message.success.update'));
    return await call('getCurrentHost');
  } catch (error) {
    message.error(error.reason);
  }
}
