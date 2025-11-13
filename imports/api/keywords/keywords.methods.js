import { Meteor } from 'meteor/meteor';
import Keywords from './keyword';
import Hosts from '../hosts/host';
import { getHost } from '../_utils/shared';

Meteor.methods({
  async getKeywords() {
    return await Keywords.find().fetchAsync();
  },

  async saveKeywords(keywords) {
    const user = await Meteor.userAsync();
    if (!user) {
      return;
    }
    try {
      await Meteor.users.updateAsync(user._id, {
        $set: {
          keywords: keywords.map((k) => ({
            keywordId: k._id,
            keywordLabel: k.label,
          })),
        },
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async createKeyword(keyword) {
    const user = await Meteor.userAsync();
    if (!user) {
      return;
    }

    if (await Keywords.findOneAsync({ label: keyword.toLowerCase() })) {
      throw new Meteor.Error('Keyword already exists');
    }

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    try {
      const keywordId = await Keywords.insertAsync({
        creatorId: user._id,
        creatorUsername: user.username,
        creationDate: new Date(),
        host,
        hostname: currentHost?.settings?.name,
        label: keyword.toLowerCase(),
      });
      return keywordId;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
