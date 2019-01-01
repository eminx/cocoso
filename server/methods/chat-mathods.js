import { Meteor } from 'meteor/meteor';

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
      throw new Meteor.Error(error);
    }
  },

  createNotifications(contextId) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }
    try {
      const theGroup = Groups.findOne(contextId);
      const theOthers = theGroup.members
        .filter(member => member.memberId !== user._id)
        .map(other => Meteor.users.findOne(other.memberId));
      theOthers.forEach(member => {
        let contextIdIndex = -1;
        for (let i = 0; i < member.notifications.length; i++) {
          if (member.notifications[i].contextId === contextId) {
            contextIdIndex = i;
            break;
          }
        }

        // const contextIdIndex = member.notifications.findIndex(
        //   notification => notification.contextId === contextId
        // );

        if (contextIdIndex !== -1) {
          const notifications = [...member.notifications];
          notifications[contextIdIndex].count += 1;
          Meteor.users.update(member._id, {
            $set: {
              notifications: notifications
            }
          });
        } else {
          Meteor.users.update(member._id, {
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
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  }
});
