import { Meteor } from 'meteor/meteor';

import { getHost } from '../_utils/shared';
import Hosts from '../hosts/host';
import Categories from './category';
import { catColors, isUserAdmin } from './category.helpers';

Meteor.methods({
  async getCategories() {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    if (!user) {
      throw new Meteor.Error('You are not allowed');
    }

    return Categories.find(
      {
        host,
      },
      {
        fields: {
          _id: 1,
          label: 1,
          color: 1,
        },
      }
    ).fetchAsync();
  },

  async addNewCategory(category, type) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    if (Categories.findOne({ label: category.toLowerCase(), host })) {
      throw new Meteor.Error('Category already exists!');
    }

    const catLength = Categories.find({ host, type }).count();

    try {
      return await Categories.insertAsync({
        host,
        type,
        label: category.toLowerCase(),
        color: catColors[catLength],
        addedBy: user._id,
        addedUsername: user.username,
        addedDate: new Date(),
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async removeCategory(categoryId) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      await Categories.removeAsync(categoryId);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
