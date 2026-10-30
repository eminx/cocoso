import Memberships from './membership';

function attachMemberships(users, memberships) {
  if (!users || users.length === 0) {
    return [];
  }

  const byUser = new Map();
  for (const m of memberships || []) {
    const key = String(m.userId);
    const list = byUser.get(key);
    if (list) {
      list.push(m);
    } else {
      byUser.set(key, [m]);
    }
  }

  return users.map((u) => ({
    ...u,
    memberships: byUser.get(String(u._id)) ?? [],
  }));
}

async function getUserMemberships(userId) {
  if (!userId) {
    return [];
  }
  return await Memberships.find({ userId }).fetchAsync();
}

function getUsersRandomlyWithAvatarsFirst(users) {
  if (!users || users.length === 0) {
    return [];
  }
  const usersWithImage = users.filter((u) => u.avatar && u.avatar.src);
  const usersWithoutImage = users.filter((u) => !u.avatar || !u.avatar.src);

  return [
    ...usersWithImage.sort(() => Math.random() - 0.5),
    ...usersWithoutImage.sort(() => Math.random() - 0.5),
  ];
}

const publicUserFields = {
  _id: 1,
  avatar: 1,
  bio: 1,
  contactInfo: 1,
  firstName: 1,
  isPublic: 1,
  keywords: 1,
  lastName: 1,
  username: 1,
};

export {
  attachMemberships,
  getUserMemberships,
  getUsersRandomlyWithAvatarsFirst,
  publicUserFields,
};
