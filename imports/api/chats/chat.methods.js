import { Meteor } from 'meteor/meteor';
import { getHost } from '../_utils/shared';
import { isContributorOrAdmin } from '../users/user.roles';
import Hosts from '../hosts/host';
import Groups from '../groups/group';
import Chats from './chat';

Meteor.methods({
  async getChatByContextId(contextId) {
    const chat = await Chats.findOneAsync({ contextId });
    return chat;
  },

  async createChat(contextName, contextId, contextType) {
    const user = await Meteor.userAsync();
    const host = getHost(this);
    const currentHost = await Hosts.findOneAsync({ host });

    if (!user || !isContributorOrAdmin(user, currentHost)) {
      throw new Meteor.Error('Not allowed!');
    }

    const theChat = await Chats.insertAsync({
      host,
      contextId,
      contextName,
      contextType,
      createdBy: {
        userId: user._id,
        username: user.username,
      },
      isNotificationOn: false,
      messages: [],
    });
    return theChat;
  },

  async addChatMessage(values) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }
    const host = getHost(this);

    try {
      await Chats.updateAsync(
        { contextId: values.contextId },
        {
          $push: {
            messages: {
              content: values.message,
              host,
              senderUsername: user.username,
              senderAvatar: user.avatar?.src,
              senderId: user._id,
              createdDate: new Date(),
            },
          },
          $set: {
            isNotificationOn: true,
            lastMessageBy: user._id,
          },
        }
      );
      if (values.context === 'groups') {
        const theGroup = await Chats.findOneAsync({
          contextId: values.contextId,
        });
        if (!theGroup) {
          return;
        }
        const unSeenIndex = theGroup?.messages?.length - 1;
        await Meteor.callAsync(
          'createGroupNotification',
          host,
          values,
          unSeenIndex
        );
      }
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  async createGroupNotification(host, values, unSeenIndex) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    const contextId = values.contextId;

    try {
      const theGroup = await Groups.findOneAsync(contextId);
      const theOthers = theGroup.members
        .filter((member) => member.memberId !== user._id)
        .map((other) => Meteor.users.findOneAsync(other.memberId));

      await Promise.all(
        theOthers.forEach(async (member) => {
          if (!member) {
            return;
          }
          let contextIdIndex = -1;
          for (let i = 0; i < member.notifications.length; i += 1) {
            if (member.notifications[i].contextId === contextId) {
              contextIdIndex = i;
              break;
            }
          }

          if (contextIdIndex !== -1) {
            const notifications = [...member.notifications];
            notifications[contextIdIndex].count += 1;
            if (!notifications[contextIdIndex].unSeenIndexes) {
              notifications[contextIdIndex].unSeenIndexes = [];
            }

            notifications[contextIdIndex].unSeenIndexes?.push(unSeenIndex);
            await Meteor.users.updateAsync(member._id, {
              $set: {
                notifications,
              },
            });
          } else {
            await Meteor.users.updateAsync(member._id, {
              $push: {
                notifications: {
                  title: theGroup.title,
                  count: 1,
                  context: 'groups',
                  contextId: theGroup._id,
                  host,
                  unSeenIndexes: [unSeenIndex],
                },
              },
            });
          }
        })
      );
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  async removeNotification(contextId, messageIndex) {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      const notifications = [...user.notifications];
      if (!notifications) {
        return;
      }

      const notificationIndex = notifications.findIndex(
        (notification) => notification.contextId === contextId
      );

      if (notificationIndex < 0) {
        return;
      }

      notifications[notificationIndex].count -= 1;

      let newNotifications;
      if (notifications[notificationIndex].count === 0) {
        newNotifications = notifications.filter(
          (notification, index) => index !== notificationIndex
        );
      } else {
        const newUnSeenIndexes = notifications[
          notificationIndex
        ].unSeenIndexes.filter((unSeenIndex) => unSeenIndex !== messageIndex);
        notifications[notificationIndex].unSeenIndexes = newUnSeenIndexes;
        newNotifications = notifications;
      }

      await Meteor.users.updateAsync(user._id, {
        $set: {
          notifications: newNotifications,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },
});
