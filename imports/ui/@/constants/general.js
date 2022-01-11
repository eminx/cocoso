const userMenu = [
  { label: 'My Profile', value: '/my-profile' },
  { label: 'My Activities', value: '/my-activities' },
  { label: 'My Works', value: '/my-works' },
];

const adminMenu = [
  { label: 'Settings', value: '/admin/settings' },
  { label: 'Members', value: '/admin/members' },
  { label: 'Resources', value: '/admin/resources' },
  { label: 'Emails', value: '/admin/emails' },
];

const hostFields = [
  {
    label: 'desired url/address',
    placeholder: 'pineapples.fanus.co',
    name: 'host',
    isRequired: true,
  },
  {
    label: 'name',
    placeholder: 'Pineapples',
    name: 'name',
    isRequired: true,
  },
  {
    label: 'contact email',
    placeholder: 'email@pineapple.com',
    name: 'email',
    isRequired: true,
  },
  {
    label: 'address',
    placeholder: 'Paul Klee Boulevard 99',
    name: 'address',
  },
  {
    label: 'city',
    placeholder: 'Pushkar',
    name: 'city',
  },
  {
    label: 'country',
    placeholder: 'Galaxy Land',
    name: 'country',
  },
  {
    label: 'about',
    placeholder: 'About your hub',
    name: 'about',
    textArea: true,
    isRequired: true,
  },
];

export { userMenu, adminMenu, hostFields };
