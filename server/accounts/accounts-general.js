Accounts.onCreateUser((options, user) => {
  user.attending = [];
  user.groups = [];
  user.notifications = [];
  if (user.services.facebook) {
    user.username = user.services.facebook.name;
    user.emails = [{ address: user.services.facebook.email }];
  } else if (user.services.google) {
    user.username = user.services.google.name;
    user.emails = [{ address: user.services.google.email }];
  }
  return user;
});
