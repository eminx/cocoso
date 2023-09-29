const userMenu = [
  {
    // label: 'My Profile',
    menu: 'member',
    key: 'publicProfile',
    value: '',
  },
  {
    menu: 'member',
    key: 'editProfile',
    value: '',
  },
  // {
  //   // label: 'My Activities',
  //   menu: 'member',
  //   key: 'activities',
  //   value: '/activities',
  // },
  // {
  //   // label: 'My Works',
  //   menu: 'member',
  //   key: 'works',
  //   value: '/works',
  // },
];

const adminMenu = [
  {
    menu: 'admin',
    key: 'settings',
    value: '/admin/settings',
  },
  {
    menu: 'admin',
    key: 'members',
    value: '/admin/members',
  },
  {
    menu: 'admin',
    key: 'emails',
    value: '/admin/emails',
  },
  {
    menu: 'admin',
    key: 'email-newsletter',
    value: '/admin/email-newsletter',
  },
  // {
  //   menu: 'admin',
  //   key: 'categories',
  //   value: '/admin/categories',
  // },
];

const superadminMenu = [
  {
    menu: 'superadmin',
    key: 'platform',
    value: '/superadmin/platform/settings',
  },
];

const hostFields = [
  {
    // label: 'desired url/address',
    // placeholder: 'pineapples.fanus.co',
    name: 'host',
    isRequired: true,
  },
  {
    // label: 'name',
    // placeholder: 'Pineapples',
    name: 'name',
    isRequired: true,
  },
  {
    // label: 'contact email',
    // placeholder: 'email@pineapple.com',
    name: 'email',
    isRequired: true,
  },
  {
    // label: 'address',
    // placeholder: 'Paul Klee Boulevard 99',
    name: 'address',
  },
  {
    // label: 'city',
    // placeholder: 'Pushkar',
    name: 'city',
  },
  {
    // label: 'country',
    // placeholder: 'Galaxy Land',
    name: 'country',
  },
  {
    // label: 'about',
    // placeholder: 'About your hub',
    name: 'about',
    textArea: true,
    isRequired: true,
  },
];

const acceptedDocumentFormatsForUploads = [
  '.doc',
  '.docx',
  '.jpeg',
  '.jpg',
  '.pdf',
  '.png',
  '.zip',
];

const maximumDocumentSizeForUploads = '30 MB';

export {
  acceptedDocumentFormatsForUploads,
  adminMenu,
  hostFields,
  maximumDocumentSizeForUploads,
  superadminMenu,
  userMenu,
};
