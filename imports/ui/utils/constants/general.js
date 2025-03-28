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
    value: '/admin/settings/organization',
  },
  {
    menu: 'admin',
    key: 'users',
    value: '/admin/users/all',
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
  {
    menu: 'admin',
    key: 'categories',
    value: '/admin/categories',
  },
];

const superadminMenu = [
  {
    menu: 'superadmin',
    key: 'platform',
    value: '/superadmin/platform/settings',
  },
  {
    menu: 'superadmin',
    key: 'registrationIntro',
    value: '/superadmin/platform/registration-intro',
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

const platformFields = [
  {
    label: 'Email',
    name: 'email',
    isRequired: true,
  },
  {
    label: 'Name',
    name: 'name',
    isRequired: true,
  },
  {
    label: 'Portal Host (Main Website)',
    name: 'portalHost',
    isRequired: true,
  },
];

const acceptedImageFormatsForUploads = ['.jpeg', '.jpg', '.png'];

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

const accordionProps = {
  buttonProps: {
    _hover: { bg: 'brand.400', color: 'white' },
    _expanded: { bg: 'brand.500', color: 'white' },
    bg: 'white',
    borderWidth: '0',
    borderRadius: 'lg',
    boxShadow: 'sm',
    color: 'gray.900',
    cursor: 'pointer',
  },
  itemProps: {
    borderTopWidth: '0',
    mb: '4',
  },
  panelProps: {
    bg: 'white',
    borderRadius: 'lg',
    mt: '2',
  },
};

export {
  acceptedImageFormatsForUploads,
  acceptedDocumentFormatsForUploads,
  accordionProps,
  adminMenu,
  hostFields,
  platformFields,
  maximumDocumentSizeForUploads,
  superadminMenu,
  userMenu,
};
