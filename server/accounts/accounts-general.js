Accounts.onCreateUser((options, user) => {
  user.attending = [];
  if (user.services && user.services.facebook) {
	  user.username = user.services.facebook.name;
	  user.emails = [{address: user.services.facebook.email}];
	}
	return user;
});