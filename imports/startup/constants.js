const defaultMenu = [
  {
    label: 'Activities',
    name: 'activities',
    isVisible: true,
    isHomePage: true,
  },
  {
    label: 'Groups',
    name: 'groups',
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
    label: 'People',
    name: 'people',
    isVisible: true,
    isHomePage: false,
  },
  {
    label: 'Resources',
    name: 'resources',
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

const defaultEmails = [
  {
    key: 'participant',
    subject: 'Welcome!',
    appeal: 'Dear',
    body: 'Welcome! As new part of our community, you may attend our groups and public events. Look forward to hanging out with you!',
  },
  {
    key: 'cocreator',
    subject: 'You are now verified',
    appeal: 'Dear',
    body: 'You are now verified in our community. This means that you are privileged to create public activities & groups, publish your works, and book resources in our community. \nLook forward!',
  },
  {
    key: 'admin',
    subject: 'You are now an admin',
    appeal: 'Dear',
    body: 'You are now registered as an admin in our space. This means that in addition to the privileges of being a contributor; you may create new pages and configure a bunch of options in our shared system. Please use your powers responsible, and enjoy. \nLook forward!',
  },
];

const defaultTheme = {
  hue: (Math.floor(Math.random() * 360) + 1).toString(),
  body: {
    backgroundColor: '#eee',
    backgroundImage: 'none',
    backgroundRepeat: 'no-repeat',
    borderRadius: '0',
    fontFamily: 'Sarabun',
  },
  menu: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    borderRadius: '0',
    borderStyle: 'solid',
    borderWidth: '2px',
    color: '#090909',
    fontStyle: 'normal',
    textTransform: 'none',
  },
  variant: 'custom',
};

export { defaultMenu, defaultMainColor, defaultEmails };
