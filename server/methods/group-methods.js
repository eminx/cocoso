import { getRoomIndex, siteUrl } from './shared';

Meteor.methods({
  createGroup(formValues, imageUrl, documentUrl, documentId) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }
    check(formValues.title, String);
    check(formValues.description, String);
    check(formValues.readingMaterial, String);
    check(formValues.capacity, Number);
    check(documentUrl, String);
    check(documentId, String);

    try {
      const add = Groups.insert(
        {
          adminId: user._id,
          adminUsername: user.username,
          members: [
            {
              memberId: user._id,
              username: user.username,
              profileImage: user.profileImage || null,
              joinDate: new Date()
            }
          ],
          meetings: [],
          title: formValues.title,
          description: formValues.description,
          readingMaterial: formValues.readingMaterial,
          capacity: formValues.capacity || 20,
          imageUrl,
          documentUrl,
          documentId,
          isPublished: true,
          creationDate: new Date()
        },
        () => {
          Meteor.call('createChat', formValues.title, add, (error, result) => {
            if (error) {
              console.log('Chat is not created due to error: ', error);
            }
          });
        }
      );

      try {
        Meteor.users.update(user._id, {
          $addToSet: {
            groups: {
              groupId: add,
              name: formValues.title,
              joinDate: new Date(),
              meAdmin: true
            }
          }
        });
      } catch (error) {
        throw new Meteor.Error(
          error,
          "Couldn't add the group info to user collection, but group is created"
        );
        console.log(error);
      }
      return add;
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, "Couldn't add group to the collection");
    }
  },

  updateGroup(groupId, formValues, imageUrl, documentUrl, documentId) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('Not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    if (user._id !== theGroup.adminId) {
      throw new Meteor.Error('You are not allowed!');
    }

    check(formValues.title, String);
    check(formValues.description, String);
    check(formValues.readingMaterial, String);
    check(formValues.capacity, Number);
    check(documentUrl, String);
    check(documentId, String);

    try {
      const add = Groups.update(groupId, {
        $set: {
          title: formValues.title,
          description: formValues.description,
          readingMaterial: formValues.readingMaterial,
          capacity: formValues.capacity,
          imageUrl,
          documentId,
          documentUrl
        }
      });
      return groupId;
    } catch (e) {
      throw new Meteor.Error(e, "Couldn't update the group");
    }
  },

  deleteGroup(groupId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
      return false;
    }
    const groupToDelete = Groups.findOne(groupId);
    if (groupToDelete.adminId !== user._id) {
      throw new Meteor.Error('You are not allowed!');
      return false;
    }

    try {
      Groups.remove(groupId);
    } catch (error) {
      throw new Meteor.Error(error, "Couldn't remove from collection");
    }
  },

  joinGroup(groupId) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    try {
      Groups.update(theGroup._id, {
        $addToSet: {
          members: {
            memberId: user._id,
            username: user.username,
            profileImage: user.profileImage || null,
            joinDate: new Date()
          }
        }
      });
      Meteor.users.update(user._id, {
        $addToSet: {
          groups: {
            groupId: theGroup._id,
            name: theGroup.name,
            joinDate: new Date()
          }
        }
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error, 'Could not join the circle');
    }
  },

  leaveGroup(groupId) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    try {
      Groups.update(theGroup._id, {
        $pull: {
          members: {
            memberId: user._id
          }
        }
      });
      Meteor.users.update(user._id, {
        $pull: {
          groups: {
            groupId: groupId
          }
        }
      });
    } catch (error) {
      throw new Meteor.Error('Could not leave the group');
    }
  },

  addGroupMeeting(newMeeting, groupId) {
    const user = Meteor.user();
    if (!user || !user.isRegisteredMember) {
      throw new Meteor.Error('You are not allowed!');
    }

    const theGroup = Groups.findOne(groupId);
    if (theGroup.adminId !== user._id) {
      throw new Meteor.Error('You are not the admin!');
    }

    newMeeting.attendees = [];
    newMeeting.roomIndex = getRoomIndex(newMeeting.room);

    try {
      Groups.update(groupId, {
        $push: {
          meetings: newMeeting
        }
      });
    } catch (error) {
      throw new Meteor.Error(
        'Could not create the meeting due to:',
        error.reason
      );
    }
  },

  attendMeeting(groupId, meetingIndex) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    console.log(groupId, meetingIndex);

    const theGroup = Groups.findOne(groupId);
    if (!theGroup.members.map(member => member.memberId).includes(user._id)) {
      console.log('your no member');
      throw new Meteor.Error('You are not a member!');
    }

    const updatedMeetings = [...theGroup.meetings];
    updatedMeetings[meetingIndex].attendees.push({
      memberId: user._id,
      memberUsername: user.username,
      confirmDate: new Date()
    });

    try {
      Groups.update(groupId, {
        $set: {
          meetings: updatedMeetings
        }
      });
    } catch (error) {
      throw new Meteor.Error(
        'Could not registered attendance due to:',
        error.reason
      );
    }
  },

  unAttendMeeting(groupId, meetingIndex) {
    const user = Meteor.user();
    if (!user) {
      throw new Meteor.Error('You are not allowed!');
    }

    console.log(groupId, meetingIndex);

    const theGroup = Groups.findOne(groupId);
    if (!theGroup.members.map(member => member.memberId).includes(user._id)) {
      console.log('your no member');
      throw new Meteor.Error('You are not a member!');
    }

    const updatedMeetings = [...theGroup.meetings];
    const theAttendees = [...updatedMeetings[meetingIndex].attendees];
    const theAttendeesWithout = theAttendees.filter(
      attendee => attendee.memberId !== user._id
    );
    updatedMeetings[meetingIndex].attendees = theAttendeesWithout;

    try {
      Groups.update(groupId, {
        $set: {
          meetings: updatedMeetings
        }
      });
    } catch (error) {
      throw new Meteor.Error(
        'Could not removed attendance due to:',
        error.reason
      );
    }
  }
});
