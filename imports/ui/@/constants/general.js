const userMenu = [
  { 
    // label: 'My Profile', 
    menu: 'member', 
    key: 'profile', 
    value: '/my-profile' 
  },
  { 
    // label: 'My Activities', 
    menu: 'member', 
    key: 'activities', 
    value: '/my-activities' 
  },
  { 
    // label: 'My Works', 
    menu: 'member', 
    key: 'works', 
    value: '/my-works' 
  },
];

const adminMenu = [
  { 
    // label: 'Settings', 
    menu: 'admin', 
    key: 'settings', 
    value: '/admin/settings' 
  },
  { 
    // label: 'Members', 
    menu: 'admin', 
    key: 'members', 
    value: '/admin/members' 
  },
  { 
    // label: 'Resources', 
    menu: 'admin', 
    key: 'resources', 
    value: '/admin/resources' 
  },
  { 
    // label: 'Emails', 
    menu: 'admin', 
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
