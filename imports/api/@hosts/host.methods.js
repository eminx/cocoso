import { Meteor } from 'meteor/meteor';
import { getHost } from '../@/shared';
import Hosts from './host';
import Pages from '../pages/page';
import {
  defaultMenu,
  defaultMainColor,
  defaultEmails,
} from '../../startup/@/constants';

Meteor.methods({
  async createNewHost(values) {
    const currentUser = Meteor.user();
    if (!currentUser || !currentUser.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed!');
    }

    if (Hosts.findOne({ host: values.host })) {
      throw new Meteor.Error('A hub with this url already exists');
    }

    try {
      const hostId = await Hosts.insert({
        host: values.host,
        email: values.email,
        settings: {
          name: values.name,
          email: values.email,
          address: values.address,
          city: values.city,
          country: values.country,
          mainColor: defaultMainColor,
          menu: defaultMenu,
        },
        members: [
          {
            username: currentUser.username,
            id: currentUser._id,
            email: currentUser.emails[0].address,
            role: 'admin',
            date: new Date(),
          },
        ],
        emails: defaultEmails,
        createdAt: new Date()
      });

      await Pages.insert({
        host: values.host,
        authorId: currentUser._id,
        authorName: currentUser.username,
        title: `About ${values.name}`,
        longDescription: values.about,
        isPublished: true,
        creationDate: new Date(),
      });

      Meteor.users.update(currentUser._id, {
        $push: {
          memberships: {
            host: values.host,
            hostId: hostId,
            role: 'admin',
            date: new Date(),
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }
  },
  
  getHostMembers() {
    const host = getHost(this);
    const currentHost = Hosts.findOne({ host: host });
    const members = currentHost.members.map((member) => {
      const user = Meteor.users.findOne(member.id);
      const avatarSrc = user && user.avatar && user.avatar.src;
      if (user) {
        return {
          ...member,
          avatarSrc,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
        };
      }
    });
    const validMembers = members.filter((member) => member && member.id);
    return validMembers;
  },
});
