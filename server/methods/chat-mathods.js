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
    } catch (error) {
      console.log('error', error);
    }
  }
});
