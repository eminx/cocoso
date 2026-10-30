import { Meteor } from 'meteor/meteor';
import Keywords from './keyword';
import Hosts from '../hosts/host';
import { getHost } from '../_utils/shared';

Meteor.methods({
  async getKeywords() {
    return await Keywords.find({}, { sort: { label: 1 } }).fetchAsync();
  },

  async getKeywordsForAdmin() {
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const allKeywords = await Keywords.find(
      {},
      { sort: { label: 1 } }
    ).fetchAsync();

    if (currentHost.isPortalHost) {
      return allKeywords;
    }
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      return allKeywords.filter((k) => k.host === host);
    }
    return allKeywords.filter(
      (k) =>
        k.host === host ||
        k.creatorId === currentUser._id ||
        currentUser.keywords.find((key) => key.keywordId === k._id)
    );
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
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      return;
    }

    const existingKeyword = await Keywords.findOneAsync({
      label: keyword.toLowerCase(),
    });

    if (existingKeyword) {
      await Meteor.users.updateAsync(currentUser._id, {
        $push: {
          keywords: {
            keywordId: existingKeyword._id,
            keywordLabel: existingKeyword.label,
          },
        },
      });
      return;
    }

    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    try {
      const keywordId = await Keywords.insertAsync({
        creatorId: currentUser._id,
        creatorUsername: currentUser.username,
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
