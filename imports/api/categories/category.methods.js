import { Meteor } from 'meteor/meteor';

import { getHost } from '../_utils/shared';
import Hosts from '../hosts/host';
import Categories from './category';
import { catColors, isUserAdmin } from './category.helpers';

Meteor.methods({
  getCategories() {
    const user = Meteor.user();
    const host = getHost(this);
    if (!user) {
      throw new Meteor.Error('You are not allowed');
    }

    return Categories.find({
      host,
    }).fetch();
  },

  addNewCategory(category, type) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    if (Categories.findOne({ label: category.toLowerCase(), host })) {
      throw new Meteor.Error('Category already exists!');
    }

    const catLength = Categories.find({ host, type }).count();

    try {
      return Categories.insert({
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

  removeCategory(categoryId) {
    const user = Meteor.user();
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host });
    const isAdmin = currentHost && isUserAdmin(currentHost.members, user._id);

    if (!user.isSuperAdmin && !isAdmin) {
      throw new Meteor.Error('You are not allowed');
    }

    try {
      Categories.remove(categoryId);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
