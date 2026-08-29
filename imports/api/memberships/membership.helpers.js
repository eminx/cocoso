import Memberships from './membership';

// Returns the memberships array for a single user, used where a full user
// document needs a `memberships` field reattached (frontend expects it).
async function getUserMemberships(userId) {
  if (!userId) {
    return [];
  }
  return await Memberships.find({ userId }).fetchAsync();
}

// Reattaches a `memberships` field to each user object in `users`, sourced
// live from the Memberships collection (no more embedded array on the user
// doc). Leaves users without any memberships with an empty array.
async function attachMembershipsToUsers(users) {
  if (!users || users.length === 0) {
    return users || [];
  }

  const userIds = users.map((user) => user._id);
  const memberships = await Memberships.find({
    userId: { $in: userIds },
  }).fetchAsync();

  return users.map((user) => ({
    ...user,
    memberships: memberships.filter((m) => m.userId === user._id),
  }));
}

export { attachMembershipsToUsers, getUserMemberships };
