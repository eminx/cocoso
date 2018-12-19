import { Meteor } from 'meteor/meteor';
import { notification } from 'antd';

Meteor.methods({
  createChat(contextName, contextId) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }

    const theChat = Chats.insert({
      contextName: contextName,
      contextId: contextId,
      createdBy: {
        userId: user._id,
        username: user.username
      },
      isNotificationOn: false,
      messages: new Array()
    });
    return theChat;
  },

  addChatMessage(contextId, msgBody) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Chats.update(
        { contextId: contextId },
        {
          $push: {
            messages: {
              content: msgBody,
              senderUsername: user.username,
              senderId: user._id,
              createdDate: new Date()
            }
          },
          $set: {
            isNotificationOn: true,
            lastMessageBy: user._id
          }
        }
      );
      Meteor.call('createNotifications', contextId);
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  createNotifications(contextId) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      const theChat = Chats.findOne({ contextId });
      if (theChat.contextName === 'group') {
        const theGroup = Groups.findOne({ contextId: contextId });
        const theOthers = theGroup.members.map(
          member => member.memberId !== user._id
        );
        theOthers.forEach(member => {
          const doesExist =
            member.notifications &&
            member.notifications.some(
              notification => notification.contextId === contextId
            );
          if (doesExist) {
            Meteor.users.updateOne(member.memberId, {
              $inc: {
                'notifications.$.count': 1
              }
            });
            console.log('x');
          } else {
            Meteor.users.updateOne(member.memberId, {
              $push: {
                notifications: {
                  title: theGroup.title,
                  count: 1,
                  context: 'group',
                  contextId: theGroup._id
                }
              }
            });
          }
        });
      }
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  }
});
