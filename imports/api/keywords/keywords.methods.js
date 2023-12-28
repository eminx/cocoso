import { Meteor } from 'meteor/meteor';
import Keywords from './keyword';
import Hosts from '../hosts/host';
import { getHost } from '../_utils/shared';

Meteor.methods({
  getKeywords() {
    return Keywords.find().fetch();
  },

  saveKeywords(keywords) {
    const user = Meteor.user();
    if (!user) {
      return;
    }
    try {
      Meteor.users.update(user._id, {
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

  createKeyword(keyword) {
    const user = Meteor.user();
    if (!user) {
      return;
    }

    if (Keywords.findOne({ label: keyword.toLowerCase() })) {
      throw new Meteor.Error('Keyword already exists');
    }

    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });

    try {
      const keywordId = Keywords.insert({
        creatorId: user._id,
        creatorUsername: user.username,
        creationDate: new Date(),
        host,
        hostname: currentHost?.settings?.name,
        label: keyword.toLowerCase(),
      });
      return keywordId;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },
});
