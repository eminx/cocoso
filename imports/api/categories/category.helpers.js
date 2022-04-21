const catColors = [
  'hsla(10, 62%, 80%, 0.7)',
  'hsla(46, 62%, 80%, 0.7)',
  'hsla(82, 62%, 80%, 0.7)',
  'hsla(118, 62%, 80%, 0.7)',
  'hsla(154, 62%, 80%, 0.7)',
  'hsla(190, 62%, 80%, 0.7)',
  'hsla(226, 62%, 80%, 0.7)',
  'hsla(262, 62%, 80%, 0.7)',
  'hsla(298, 62%, 80%, 0.7)',
  'hsla(334, 62%, 80%, 0.7)',
];

const isUserAdmin = (members, userId) => members.some(
  member => member.id === userId && member.role === 'admin',
);


export {
  catColors,
  isUserAdmin,
};
