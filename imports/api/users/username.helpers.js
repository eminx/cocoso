import { Accounts } from 'meteor/accounts-base';

// Matches regexUsername in imports/ui/pages/auth/account.helpers.js — keep
// these in sync, since a username generated here must also pass that
// client-side schema if it's ever edited/re-submitted through a form there.
const USERNAME_CHARS = /[^a-z0-9]/g;
const MIN_USERNAME_LENGTH = 4;
const MAX_USERNAME_LENGTH = 20;
const MAX_COLLISION_ATTEMPTS = 5;

function sanitize(raw) {
  return String(raw || '').toLowerCase().replace(USERNAME_CHARS, '');
}

function randomDigits(count) {
  let out = '';
  for (let i = 0; i < count; i += 1) {
    out += Math.floor(Math.random() * 10);
  }
  return out;
}

// Given any candidate base string, returns a username that's both
// well-formed (regexUsername-compatible, length-bounded) and confirmed
// unique against Meteor.users at the moment of return.
async function generateUniqueUsername(candidateBase) {
  let base = sanitize(candidateBase);
  if (base.length < MIN_USERNAME_LENGTH) {
    base += randomDigits(MIN_USERNAME_LENGTH - base.length);
  }
  base = base.slice(0, MAX_USERNAME_LENGTH);

  let candidate = base;
  for (let attempt = 0; attempt < MAX_COLLISION_ATTEMPTS; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    const taken = await Accounts.findUserByUsername(candidate);
    if (!taken) {
      return candidate;
    }
    const suffix = randomDigits(3);
    candidate = `${base.slice(0, MAX_USERNAME_LENGTH - suffix.length)}${suffix}`;
  }

  // Extremely unlikely to be reached — falls back to a value guaranteed
  // unique enough in practice rather than looping forever.
  return `${base.slice(0, MAX_USERNAME_LENGTH - 8)}${Date.now().toString(36)}`;
}

async function generateUsernameFromEmail(email) {
  const localPart = String(email || '').split('@')[0];
  return generateUniqueUsername(localPart);
}

export { generateUniqueUsername, generateUsernameFromEmail };
