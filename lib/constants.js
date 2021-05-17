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

const defaultMenu = [
  {
    label: 'Activities',
    name: 'activities',
    isVisible: true,
    isHomePage: true,
  },
  {
    label: 'Processes',
    name: 'processes',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'Calendar',
    name: 'calendar',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'Works',
    name: 'works',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'Members',
    name: 'members',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'Info',
    name: 'info',
    isVisible: true,
    isHomePage: false,
  },
];

const defaultMainColor = {
  hsl: {
    h: '144',
    s: 0.8,
    l: 0.35,
  },
};

export { hostFields, defaultMenu, defaultMainColor };
