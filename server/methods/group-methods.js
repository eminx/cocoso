Meteor.methods({
	createGroup(formValues, imageUrl) {
		const user = Meteor.user();
		if (!user) {
			return false;
		}
		check(formValues.title, String);
		check(formValues.description, String);
		check(formValues.readingMaterial, String);
		check(formValues.capacity, Number);
		
		try {
			const add = Groups.insert({
				authorId: user._id,
				members: [],
				authorName: user.username,
				title: formValues.title,
				description: formValues.description,
				readingMaterial: formValues.readingMaterial,
				capacity: formValues.capacity || 20,
				imageUrl,
				isPublished: true,
				creationDate: new Date()
			}, () => Meteor.call('createChat', formValues.title, add, (error, result) => {
				if (error) {
					console.log('Chat is not created due to error: ', error)
				}
			}));
			return add;
		} catch(e) {
			throw new Meteor.Error(e, "Couldn't add group to the collection");
		}
	},

	updateGroup(formValues, groupId) {
		const user = Meteor.user();
		if (!user) {
			return false;
		}

		const theGroup = Groups.findOne(groupId);
		if (user._id !== theGroup.authorId) {
			throw new Meteor.Error("You are not allowed!");
			return false;
		};

		check(formValues.title, String);
		check(formValues.description, String);
		check(formValues.readingMaterial, String);
		check(formValues.capacity, Number);

		
		try {
			const add = Groups.update(groupId, {
				$set: {
					title: formValues.title,
					description: formValues.description,
					readingMaterial: formValues.readingMaterial,
					capacity: formValues.capacity
				}
			});
			return groupId;
		} catch(e) {
			throw new Meteor.Error(e, "Couldn't update the group");
		}
	},
})