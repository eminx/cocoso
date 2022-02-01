const userMenu = [
  { 
    label: 'My Profile', 
    key: 'profile', 
    value: '/my-profile' 
  },
  { 
    label: 'My Activities', 
    key: 'activities', 
    value: '/my-activities' 
  },
  { 
    label: 'My Works', 
    key: 'works', 
    value: '/my-works' 
  },
];

const adminMenu = [
  { 
    label: 'Settings', 
    key: 'settings', 
    value: '/admin/settings' 
  },
  { 
    label: 'Members', 
    key: 'members', 
    value: '/admin/members' 
  },
  { 
    label: 'Resources', 
    key: 'resources', 
    value: '/admin/resources' 
  },
  { 
    label: 'Emails', 
    key: 'emails', 
    value: '/admin/emails' 
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

export { userMenu, adminMenu, hostFields };
