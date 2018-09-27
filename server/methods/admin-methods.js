Meteor.methods({
  verifyMember(memberId) {
    const user = Meteor.user();
    if (!user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed');
    }
    try {
      Meteor.users.update(memberId, {
        $set: {
          isRegisteredMember: true
        }
      });
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  },

  unVerifyMember(memberId) {
    const user = Meteor.user();
    if (!user.isSuperAdmin) {
      throw new Meteor.Error('You are not allowed');
    }
    try {
      Meteor.users.update(memberId, {
        $set: {
          isRegisteredMember: false
        }
      });
    } catch (error) {
      throw new Meteor.Error(error, 'Did not work! :/');
    }
  }
});
